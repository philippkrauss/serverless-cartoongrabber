const grabber = require('../src/grabber')
const axios = require('axios')
const MockDate = require('mockdate')

jest.mock('axios')

const CARTOON_URL = 'some-cartoon-url.jpg'
const HTML_CONTENT = `<meta property="og:image" content="${CARTOON_URL}">`
const SOURCE = {
	name: 'ruthe',
	url: 'https://www.ruthe.de/',
}

test('grab a cartoon using meta property', async () => {
	const axiosGetStub = axios.get.mockResolvedValue({ data: HTML_CONTENT })
	const cartoon = await grabber.grabUsingMetaProperty(SOURCE)
	expect(axiosGetStub).toHaveBeenCalledTimes(1)
	expect(axiosGetStub).toHaveBeenCalledWith('https://www.ruthe.de/')
	expect(cartoon).toEqual({
		lastImageUrl: CARTOON_URL,
		name: 'ruthe',
	})
})
test('HTTP error when grabbing using meta property', async () => {
	axios.get.mockRejectedValue(new Error())
	const cartoon = await grabber.grabUsingMetaProperty(SOURCE)
	expect(cartoon).toBeUndefined()
})
test('bad HTML returned when grabbing using meta property', async () => {
	axios.get.mockResolvedValue({ data: 'this does not match!' })
	const cartoon = await grabber.grabUsingMetaProperty(SOURCE)
	expect(cartoon).toBeUndefined()
})

test('grab a cartoon using date and meta property', async () => {
	MockDate.set('2020-06-01')
	const axiosGetStub = axios.get.mockResolvedValue({ data: HTML_CONTENT })
	const cartoon = await grabber.grabUsingDateAndMetaProperty(SOURCE)
	expect(axiosGetStub).toHaveBeenCalledTimes(1)
	expect(axiosGetStub).toHaveBeenCalledWith('https://www.ruthe.de/2020-06-01')
	expect(cartoon).toEqual({
		lastImageUrl: CARTOON_URL,
		name: 'ruthe',
	})
})
