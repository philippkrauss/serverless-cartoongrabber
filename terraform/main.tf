terraform {
  backend "s3" {
	bucket = "phkr-terraform"
	key    = "terraform.tfstate"
	region = "eu-central-1"
  }
  required_providers {
	aws = {
	  source  = "hashicorp/aws"
	  version = "~> 4.16"
	}
  }

  required_version = ">= 1.2.0"
}
provider "aws" {
  region = "eu-central-1"
}

variable "table_name" {
  type    = string
  default = "terraform-cartoons"
}

variable "slack_channel_name" {
  type    = string
  default = "cartoons-dev"
}

data "aws_ssm_parameter" "slack_url" {
  name = "/cartoongrabber/dev/slack-url"
}


resource "aws_iam_role" "lambda_role" {
  name               = "cartoongrabber_tf_grab_function_Role"
  assume_role_policy = jsonencode({
	"Version" : "2012-10-17",
	"Statement" : [
	  {
		"Action" : "sts:AssumeRole",
		"Principal" : {
		  "Service" : "lambda.amazonaws.com"
		},
		"Effect" : "Allow",
		"Sid" : ""
	  }
	]
  })
}

resource "aws_iam_policy" "iam_policy_for_lambda" {
  name        = "policy_for_terraform_cartoongrabber_lambda_role"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
  policy      = jsonencode({
	"Version" : "2012-10-17",
	"Statement" : [
	  {
		"Action" : [
		  "logs:CreateLogGroup",
		  "logs:CreateLogStream",
		  "logs:PutLogEvents"
		],
		"Resource" : "arn:aws:logs:*:*:*",
		"Effect" : "Allow"
	  },
	  {
		"Sid" : "SpecificTable",
		"Effect" : "Allow",
		"Action" : [
		  "dynamodb:PutItem"
		],
		"Resource" : "arn:aws:dynamodb:*:*:table/${aws_dynamodb_table.terraform_cartoongrabber_table.name}"
	  },
	  {
		"Sid" : "APIAccessForDynamoDBStreams",
		"Effect" : "Allow",
		"Action" : [
		  "dynamodb:GetRecords",
		  "dynamodb:GetShardIterator",
		  "dynamodb:DescribeStream",
		  "dynamodb:ListStreams"
		],
		"Resource" : "${aws_dynamodb_table.terraform_cartoongrabber_table.arn}/stream/*"
	  }
	]
  })
}

resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.iam_policy_for_lambda.arn
}

data "archive_file" "grabber_zip" {
  type        = "zip"
  source_file = "${path.root}/../dist/grab/index.js"
  output_path = "${path.root}/../dist/grab.zip"
}
data "archive_file" "reporter_zip" {
  type        = "zip"
  source_file = "${path.root}/../dist/report/index.js"
  output_path = "${path.root}/../dist/report.zip"
}

resource "aws_lambda_function" "terraform_lambda_func_grab" {
  filename         = "${path.root}/../dist/grab.zip"
  function_name    = "cartoongrabber_tf_grab_function"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.grab"
  runtime          = "nodejs18.x"
  depends_on       = [aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role]
  source_code_hash = data.archive_file.grabber_zip.output_base64sha256
  timeout          = 12

  environment {
	variables = {
	  CARTOON_TABLE = aws_dynamodb_table.terraform_cartoongrabber_table.name
	}
  }
}

resource "aws_lambda_function" "terraform_lambda_func_report" {
  filename         = "${path.root}/../dist/report.zip"
  function_name    = "cartoongrabber_tf_report_function"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.report"
  runtime          = "nodejs18.x"
  depends_on       = [aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role]
  source_code_hash = data.archive_file.reporter_zip.output_base64sha256

  environment {
	variables = {
	  SLACK_URL          = data.aws_ssm_parameter.slack_url.value
	  SLACK_CHANNEL_NAME = var.slack_channel_name
	}
  }
}

resource "aws_dynamodb_table" "terraform_cartoongrabber_table" {
  name             = var.table_name
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "name"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
	name = "name"
	type = "S"
  }
}

resource "aws_lambda_event_source_mapping" "lambda_dynamodb" {
  event_source_arn  = aws_dynamodb_table.terraform_cartoongrabber_table.stream_arn
  function_name     = aws_lambda_function.terraform_lambda_func_report.arn
  starting_position = "LATEST"
  batch_size        = 1
}

//TODO cron trigger
//TODO stages dev/prod
//todo parametrisieren von z.B. Tabellenname, lambda-name, schedule
