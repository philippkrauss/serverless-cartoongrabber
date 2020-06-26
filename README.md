# serverless-cartoongrabber
## how to
### deploy / undeploy
`sls deploy -v --stage dev/prod`

`sls remove --stage dev/prod`

### run grabber in dev
the grabber's dev stage does not have any regular trigger. 
Instead, execute it on demand using the following command:

`sls invoke -f grab --stage dev`

## Technical details
### storing secrets
This project stores its secrets using AWS SSM (Systems Manager).
In AWS console, go to Systems Manager -> Parameter store.

One example for a secret used in this project is `/cartoongrabber/dev/slack-url`

The store does not necessarily have to be used for secrets only. 
Other config values can also be stored there. An example for such a config value is `/cartoongrabber/dev/slack-channel-name`

Secrets are evaluated at deployment time, so in order to change a secret, a redeploy is necessary!

### slack integration
For slack integration, cartoongrabber uses the slack app 'incoming-webhook'.

After the app is set up, configure its URL as SecureString in AWS SSM as `/cartoongrabber/<stage>/slack-url`

### DynamoDB
The necessary table in AWS DynamoDB is automatically created.

## useful commands

sls deploy -v --stage dev
sls remove --stage dev
sls invoke local -f grab
sls invoke -f grab --stage dev

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
tagging for all resources
get notified of errors in logs / other issues
trigger build in aws
terraform: setup CI/CD

## Future Ideas

- use typescript
