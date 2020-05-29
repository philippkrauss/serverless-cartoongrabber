const axios = require('axios')

const slackToken = process.env.SLACK_TOKEN
const slackChannelName = process.env.SLACK_CHANNEL_NAME

async function sendMessage(text) {
	const config = {
		headers: {
			Authorization: 'Bearer ' + slackToken,
		},
	}
	const body = {
		channel: slackChannelName,
		text,
	}
	console.log('sending to slack: ', body)
	let response = await axios.post(
		'https://slack.com/api/chat.postMessage',
		body,
		config
	)
	console.log('slack response: ', response.data)
}

module.exports = { sendMessage }
