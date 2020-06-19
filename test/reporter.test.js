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
	const response = await reporter.report(EVENT, null)
	expect(response.statusCode).toEqual(200)
	expect(sendMessageStub).toHaveBeenCalledTimes(1)
	expect(sendMessageStub).toHaveBeenCalledWith(
		`New cartoon at ${CARTOON_NAME}: ${CARTOON_URL}`
	)
})
test('handle invalid event', async () => {
	const response = await reporter.report({ invalid: 'event' }, null)
	expect(slackClient.sendMessage).toHaveBeenCalledTimes(0)
	expect(response.statusCode).toEqual(500)
})
test('handle slack error', async () => {
	const sendMessageStub = slackClient.sendMessage.mockRejectedValue({})
	const response = await reporter.report(EVENT, null)
	expect(response.statusCode).toEqual(500)
})
