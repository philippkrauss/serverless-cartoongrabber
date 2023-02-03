# serverless-cartoongrabber
## how to
### deploy / undeploy
`yarn install` 
`yarn build`
`yarn tf:apply-dev`
`yarn tf:apply-prod`

`yarn tf:destroy-dev`
`yarn tf:destroy-prod`

### run grabber in dev
the grabber's dev stage does not have any regular trigger. 
Instead, execute it using a test event in AWS lambda console.

TODO: It should also be possible to trigger the lambda using aws CLI

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
