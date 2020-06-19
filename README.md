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

other stuff:
trigger build in aws
terraform: setup CI/CD

## Future Ideas

- use typescript
