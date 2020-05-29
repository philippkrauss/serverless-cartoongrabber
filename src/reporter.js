const slackClient = require('./slackClient')
const response = require('./response')

/* eslint-disable no-unused-vars */
module.exports.report = async (event, context) => {
	/* eslint-enable */
	try {
		await slackClient.sendMessage('This is a test :tada:')
		response.createResponse({ response: 'OK' })
	} catch (error) {
		console.log('error: ', error)
		createErrorResponse({ error })
	}
}
