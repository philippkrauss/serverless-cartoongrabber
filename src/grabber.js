const axios = require('axios')
const dateFormat = require('dateformat')
const dynamoDbClient = require('./dynamoDbClient')
const log = require('lambda-log')

const SOURCES = [
	{
		name: 'Ruthe',
		url: 'https://ruthe.de/',
		grabber: grabUsingMetaProperty,
	},
	{
		name: 'XKCD',
		url: 'https://xkcd.com/',
		grabber: grabUsingMetaProperty,
	},
	{
		name: 'Zits',
		url: 'https://comicskingdom.com/zits',
		grabber: grabUsingMetaProperty,
	},
	{
		name: 'Dilbert',
		url: '"https://dilbert.com/strip/"yyyy-mm-dd',
		grabber: grabUsingDateAndMetaProperty,
	},
	{
		name: 'Garfield',
		url: '"https://www.gocomics.com/garfield/"yyyy/mm/dd',
		grabber: grabUsingDateAndMetaProperty,
	},
	{
		name: 'Hägar the Horrible',
		url: 'https://comicskingdom.com/hagar-the-horrible',
		grabber: grabUsingMetaProperty,
	},
	{
		name: 'Nicht Lustig',
		url: 'https://joscha.com/',
		regex: /<meta name="thumbnail"\s+content="(.*?)thumbs\/([a-zA-Z0-9.]*?)"/,
		grabber: grabUsingRegexExtraction,
	},
]
/* eslint-disable no-unused-vars */
async function grab(event, context) {
	/* eslint-enable */
	for (const source of SOURCES) {
		try {
			const cartoon = await source.grabber({
				name: source.name,
				url: source.url,
				regex: source.regex,
			})
			if (cartoon) {
				await addCartoonToDb(cartoon)
			}
		} catch (error) {
			log.error('an unexpected error occurred', error)
		}
	}
}

async function grabUsingMetaProperty(source) {
	try {
		log.info('grabbing using meta property, source: ', source.name)
		const websiteText = await getWebsiteText(source.url)
		const url = extractImageUrlFromMeta(websiteText)
		return createCartoon(source.name, url)
	} catch (error) {
		log.error('an error occurred when grabbing from ' + source.name, error)
	}
}

async function grabUsingRegexExtraction(source) {
	try {
		log.info('grabbing using regex extraction, source: ' + source.name)
		const websiteText = await getWebsiteText(source.url)
		const url = extractImageUrlFromRegex(websiteText, source.regex)
		return createCartoon(source.name, url)
	} catch (error) {
		log.error('an error occurred when grabbing from ' + source.name, error)
	}
}

async function grabUsingDateAndMetaProperty(source) {
	try {
		log.info('grabbing using date and meta property, source: ', source.name)
		const newUrl = dateFormat(new Date(), source.url)
		return grabUsingMetaProperty({ name: source.name, url: newUrl })
	} catch (error) {
		log.error('an error occurred when grabbing from ' + source.name, error)
	}
}
async function grabUsingUrlFromDate(source) {
	try {
		log.info('grabbing using url from date, source: ', source.name)
		const url = dateFormat(new Date(), source.url)
		log.info('using URL: ', url)
		await axios.get(url)
		return createCartoon(source.name, url)
	} catch (error) {
		log.info('no cartoon available yet')
	}
}
async function getWebsiteText(url) {
	const t0 = Date.now()
	log.info('grabbing from ' + url)
	const response = await axios.get(url)
	const duration = Date.now() - t0
	log.info(`grabbing took ${duration} millis (${url})`, { duration, url })
	return response.data
}

async function addCartoonToDb(cartoon) {
	const tableName = process.env.CARTOON_TABLE
		? process.env.CARTOON_TABLE
		: 'cartoons'
	log.info('Submitting cartoon to dynamodb', { cartoon, tableName })
	return await dynamoDbClient.put({ tableName: tableName, item: cartoon })
}

function extractImageUrlFromMeta(data) {
	return extractImageUrlFromRegex(
		data,
		/<meta property="og:image" content="(.*?)"/
	)
}

function extractImageUrlFromRegex(data, regex) {
	let matched = data.match(regex)
	if (matched && matched.length > 1) {
		matched.shift()
		log.info('extracted ', matched.join(''))
		return matched.join('')
	}
	throw new Error('did not match ' + regex + ' in ' + data)
}

function createCartoon(name, url) {
	if (!url) {
		log.info(`No URL was extracted for source ${name}`)
		return null
	}
	return {
		name: name,
		lastImageUrl: url,
	}
}

module.exports = {
	SOURCES,
	grab,
	grabUsingMetaProperty,
	grabUsingDateAndMetaProperty,
	grabUsingUrlFromDate,
	grabUsingRegexExtraction,
}
