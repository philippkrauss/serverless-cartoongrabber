table_name = "cartoons"
slack_channel_name = "#cartoons"
enable_scheduling = true
slack_url_ssm_path = "/cartoongrabber/prod/slack-url"
lambda_role_name = "cartoongrabber_lambda_role"
iam_policy_name = "policy_for_cartoongrabber_lambda_role"
grab_function_name = "cartoongrabber_grab_function"
report_function_name = "cartoongrabber_report_function"
schedule_name = "cartoongrabber_schedule"
