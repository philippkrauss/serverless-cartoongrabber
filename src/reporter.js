const slackClient = require('./slackClient')
const { createResponse, createErrorResponse } = require('./response')

/* eslint-disable no-unused-vars */
module.exports.report = async (event, context) => {
	/* eslint-enable */
	try {
		const cartoon = extractCartoonFromEvent(event)
		console.log('received new cartoon for reporting: ', cartoon)
		await slackClient.sendMessage(
			`New cartoon at ${cartoon.name}: ${cartoon.lastImageUrl}`
		)
		return createResponse({ cartoon })
	} catch (error) {
		console.error('error: ', error)
		return createErrorResponse({ error })
	}
}
function extractCartoonFromEvent(event) {
	try {
		const record = getRecord(event)
		const newImage = getNewImage(record)
		return {
			name: newImage.name.S,
			lastImageUrl: newImage.lastImageUrl.S,
		}
	} catch (error) {
		console.error('event has bad structure', event)
		throw error
	}
}

function getRecord(event) {
	return event.Records[0]
}
function getNewImage(record) {
	return record.dynamodb.NewImage
}
