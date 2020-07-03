const slackClient = require('./slackClient')
const log = require('lambda-log')

/* eslint-disable no-unused-vars */
module.exports.report = async (event, context) => {
	/* eslint-enable */
	try {
		const cartoon = extractCartoonFromEvent(event)
		log.info('received new cartoon for reporting: ', cartoon)
		await slackClient.sendMessage(
			`New cartoon at ${cartoon.name}: ${cartoon.lastImageUrl}`
		)
		return true
	} catch (error) {
		log.error('error: ', error)
		return false
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
		log.error('event has bad structure', event)
		throw error
	}
}

function getRecord(event) {
	return event.Records[0]
}
function getNewImage(record) {
	return record.dynamodb.NewImage
}
