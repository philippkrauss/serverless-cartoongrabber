const axios = require('axios')

const slackUrl = process.env.SLACK_URL
const slackChannelName = process.env.SLACK_CHANNEL_NAME

async function sendMessage(text) {
	const body = {
		channel: slackChannelName,
		username: 'cartoongrabber',
		icon_emoji: ':tada:',
		text,
	}
	console.log('sending to slack: ', body)
	let response = await axios.post(slackUrl, body)
	console.log('slack response: ', response.data)
}

module.exports = { sendMessage }
