const dynamodb = require('serverless-dynamodb-client');

const docClient = dynamodb.doc;

function put({tableName, item}) {
    return docClient.put({
        TableName: tableName,
        Item: item,
    }).promise()
}

module.exports = {put}
