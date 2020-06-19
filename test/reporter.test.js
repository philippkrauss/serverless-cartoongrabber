const reporter = require('../src/reporter')
const slackClient = require('../src/slackClient')

jest.mock('../src/slackClient')

const CARTOON_NAME = 'cartoon-name'
const CARTOON_URL = 'some-url'
const EVENT = {
	Records: [
		{
			dynamodb: {
				NewImage: {
					name: { S: CARTOON_NAME },
					lastImageUrl: { S: CARTOON_URL },
				},
			},
		},
	],
}

test('report a new cartoon to slack', async () => {
	const sendMessageStub = slackClient.sendMessage.mockResolvedValue({})
	await reporter.report(EVENT, null)
	expect(sendMessageStub).toHaveBeenCalledTimes(1)
	expect(sendMessageStub).toHaveBeenCalledWith(
		`New cartoon at ${CARTOON_NAME}: ${CARTOON_URL}`
	)
})
test('handle invalid event', async () => {
	const result = await reporter.report({ invalid: 'event' }, null)
	expect(slackClient.sendMessage).toHaveBeenCalledTimes(0)
	expect(result).toEqual(false)
})
test('handle slack error', async () => {
	const sendMessageStub = slackClient.sendMessage.mockRejectedValue({})
	const result = await reporter.report(EVENT, null)
	expect(result).toEqual(false)
})
