# serverless-cartoongrabber
## how to
### deploy / undeploy
`sls deploy -v`

`sls remove`

## Technical details
### storing secrets
This project stores its secrets using AWS SSM (Systems Manager).
In AWS console, go to Systems Manager -> Parameter store.

One example for a secret used in this project is `cartoongrabber-slack-secret`

The store does not necessarily have to be used for secrets only. 
Other config values can also be stored there. An example for such a config value is `cartoongrabber-slack-channel-name`

Secrets are evaluated at deployment time, so in order to change a secret, a redeploy is necessary!

### slack integration
To get slack up and running, a slack workspace with an app is required. 
The app needs to be part of a channel.
This article describes how to set this up: https://api.slack.com/messaging/sending

After the app is set up, configure its token in AWS SSM as `cartoongrabber-slack-secret`

### DynamoDB
The necessary table in AWS DynamoDB is automatically created.

## useful commands

sls deploy -v
sls remove
sls invoke local -f grab

## local execution

- install dynamodb: `sls dynamodb install`
- start dynamodb and create tables: `sls dynamodb start`
- invoke function: `IS_OFFLINE=true sls invoke local -f grab`

or, using serverless-offline:

- install dynamodb: `sls dynamodb install`
- start offline: `sls offline start`

### cleanup

- `sls dynamodb remove`

# plan

1. get img URLs

- trigger regularly
- extract URL

Garfield:
generate URL from date: https://d1ejxu6vysztl5.cloudfront.net/comics/garfield/2020/2020-04-24.gif

Ruthe:
GET https://ruthe.de, extract URL from <meta property="og:image" content="https://ruthe.de/cartoons/strip_2229.jpg">

Zits:
GET https://www.comicskingdom.com/zits/, extract URL from <meta property="og:image" content="https://safr.kingfeatures.com/api/img.php?e=gif&s=c&file=Wml0cy8yMDIwLzA0L1ppdHMuMjAyMDA0MjRfMTUzNi5naWY=" />

Dilbert:
GET https://dilbert.com/strip/2020-04-24, extract URL from <meta property="og:image" content="http://assets.amuniversal.com/aa119890567f0138f584005056a9545d"/>

2. check if URL is new

- persist last valid URL
- technologies: DB, plain file, S3 bucket

3. post URL to slack
   https://api.slack.com/messaging/sending
   https://api.slack.com/methods/chat.postMessage

around:
trigger build in aws
terraform: setup CI/CD
serverless: deploy

## Future Ideas

- use typescript
