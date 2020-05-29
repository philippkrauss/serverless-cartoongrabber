const slackClient = require('./slackClient')

/* eslint-disable no-unused-vars */
module.exports.report = async (event, context) => {
	/* eslint-enable */
	try {
		await slackClient.sendMessage('This is a test :tada:')
		return {
			statusCode: 200,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ response: 'OK' }),
		}
	} catch (error) {
		console.log('error: ', error)
		return {
			statusCode: 500,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ error }),
		}
	}
}
