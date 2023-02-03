const dynamoDB = require('aws-sdk/clients/dynamodb')
const docClient = new dynamoDB.DocumentClient()

function put({ tableName, item }) {
	return docClient
		.put({
			TableName: tableName,
			Item: item,
		})
		.promise()
}

module.exports = { put }
