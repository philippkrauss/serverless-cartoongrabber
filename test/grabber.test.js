const grabber = require('../src/grabber')
const axios = require('axios')
const MockDate = require('mockdate')

jest.mock('axios')

const CARTOON_URL = 'some-cartoon-url.jpg'
const HTML_CONTENT = `<meta property="og:image" content="${CARTOON_URL}">`
const HTML_CONTENT_THUMBNAIL =
	'<meta name="thumbnail"\n' +
	'          content="https://joscha.com/data/media/cartoons/thumbs/7f5700aa70628b0a10b5a9c72ea3c50d.png"/> asdf" thumbs/7f5700aa70628b0a10b5a9c72ea3c50d.png"'
const CARTOON_URL_WITHOUT_THUMBS =
	'https://joscha.com/data/media/cartoons/7f5700aa70628b0a10b5a9c72ea3c50d.png'
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
	const cartoon = await grabber.grabUsingDateAndMetaProperty({
		name: 'ruthe',
		url: '"https://www.ruthe.de/"yyyy-mm-dd',
	})
	expect(axiosGetStub).toHaveBeenCalledTimes(1)
	expect(axiosGetStub).toHaveBeenCalledWith('https://www.ruthe.de/2020-06-01')
	expect(cartoon).toEqual({
		lastImageUrl: CARTOON_URL,
		name: 'ruthe',
	})
})

test('grab a cartoon using date-formatted url', async () => {
	MockDate.set('2020-06-01')
	const axiosGetStub = axios.get.mockResolvedValue({})

	const cartoon = await grabber.grabUsingUrlFromDate({
		name: 'test',
		url: '"http://www.test.de/"yyyy/yyyy-mm-dd',
	})

	expect(axiosGetStub).toHaveBeenCalledTimes(1)
	expect(axiosGetStub).toHaveBeenCalledWith(
		'http://www.test.de/2020/2020-06-01'
	)
	expect(cartoon).toEqual({
		lastImageUrl: 'http://www.test.de/2020/2020-06-01',
		name: 'test',
	})
})

test('date-formatted url not yet available', async () => {
	axios.get.mockRejectedValue({})
	const cartoon = await grabber.grabUsingUrlFromDate({
		name: 'test',
		url: '"http://www.test.de/"yyyy/yyyy-mm-dd',
	})
	expect(cartoon).toBeUndefined()
})
test('grab a cartoon using regex extraction', async () => {
	const axiosGetStub = axios.get.mockResolvedValue({
		data: HTML_CONTENT_THUMBNAIL,
	})

	const cartoon = await grabber.grabUsingRegexExtraction({
		name: 'Nicht Lustig',
		url: 'https://joscha.com/',
		regex: /<meta name="thumbnail"\s+content="(.*?)thumbs\/([a-zA-Z0-9\.]*?)"/,
	})
	expect(axiosGetStub).toHaveBeenCalledTimes(1)
	expect(axiosGetStub).toHaveBeenCalledWith('https://joscha.com/')
	expect(cartoon).toEqual({
		lastImageUrl: CARTOON_URL_WITHOUT_THUMBS,
		name: 'Nicht Lustig',
	})
})
