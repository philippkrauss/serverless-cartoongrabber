# serverless-cartoongrabber

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
- prettier
