const grabber = require('../src/grabber')
const axios = require('axios')
const dynamoDbClient = require('../src/dynamoDbClient')

jest.mock('axios')
jest.mock('../src/dynamoDbClient')

const CARTOON_URL = 'some-cartoon-url.jpg'
const HTML_CONTENT = `<meta property="og:image" content="${CARTOON_URL}">`

test('grab a cartoon and store it into dynamodb', async () => {
	const axiosGetStub = axios.get.mockResolvedValue({ data: HTML_CONTENT })
	const dynamoDbPutStub = dynamoDbClient.put.mockResolvedValue({})
	const response = await grabber.grab(null, null)
	expect(response.statusCode).toEqual(200)
	expect(axiosGetStub).toHaveBeenCalledTimes(1)
	expect(axiosGetStub).toHaveBeenCalledWith('https://www.ruthe.de')
	expect(dynamoDbPutStub).toHaveBeenCalledTimes(1)
	expect(dynamoDbPutStub).toHaveBeenCalledWith({
		tableName: 'cartoons',
		item: {
			lastImageUrl: CARTOON_URL,
			name: 'ruthe',
		},
	})
})
test('HTTP error when grabbing', async () => {
	axios.get.mockRejectedValue(new Error())
	const response = await grabber.grab(null, null)
	expect(response.statusCode).toEqual(500)
})
test('bad HTML returned when grabbing', async () => {
	axios.get.mockResolvedValue({ data: 'this does not match!' })
	const response = await grabber.grab(null, null)
	expect(response.statusCode).toEqual(500)
})
test('bad HTML returned when grabbing', async () => {
	axios.get.mockResolvedValue({ data: 'this does not match!' })
	const response = await grabber.grab(null, null)
	expect(response.statusCode).toEqual(500)
})
test('dynamodb error when grabbing', async () => {
	const axiosGetStub = axios.get.mockResolvedValue({ data: HTML_CONTENT })
	const dynamoDbPutStub = dynamoDbClient.put.mockRejectedValue({})
	const response = await grabber.grab(null, null)
	expect(response.statusCode).toEqual(500)
	expect(axiosGetStub).toHaveBeenCalledTimes(1)
	expect(dynamoDbPutStub).toHaveBeenCalledTimes(1)
})
