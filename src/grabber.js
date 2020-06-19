const axios = require('axios')
const dynamoDbClient = require('./dynamoDbClient')

const SOURCES = [
	{
		name: 'Ruthe',
		url: 'https://www.ruthe.de/',
		grabber: grabUsingMetaProperty,
	},
	{
		name: 'Zits',
		url: 'https://www.comicskingdom.com/zits/',
		grabber: grabUsingMetaProperty,
	},
	{
		name: 'Dilbert',
		url: 'https://dilbert.com/strip/',
		grabber: grabUsingDateAndMetaProperty,
	},
]
module.exports.SOURCES = SOURCES
/* eslint-disable no-unused-vars */
module.exports.grab = async (event, context) => {
	/* eslint-enable */
	for (const source of SOURCES) {
		try {
			const cartoon = await source.grabber({
				name: source.name,
				url: source.url,
			})
			if (cartoon) {
				await addCartoonToDb(cartoon)
			}
		} catch (error) {
			console.error('an unexpected error occurred', error)
		}
	}
}

async function grabUsingMetaProperty(source) {
	try {
		console.log('grabbing using meta property, source: ', source.name)
		const websiteText = await getWebsiteText(source.url)
		const url = extractImageUrlFromMeta(websiteText)
		return createCartoon(source.name, url)
	} catch (error) {
		console.error('an error occurred when grabbing from ' + source.name, error)
	}
}
module.exports.grabUsingMetaProperty = grabUsingMetaProperty

async function grabUsingDateAndMetaProperty(source) {
	try {
		console.log('grabbing using date and meta property, source: ', source.name)
		const newUrl = source.url + formatCurrentDate()
		return grabUsingMetaProperty({ name: source.name, url: newUrl })
	} catch (error) {
		console.error('an error occurred when grabbing from ' + source.name, error)
	}
}
module.exports.grabUsingDateAndMetaProperty = grabUsingDateAndMetaProperty

function formatCurrentDate() {
	const currentDate = new Date()
	return currentDate.toISOString().substr(0, 10)
}

async function getWebsiteText(url) {
	console.log('grabbing from ', url)
	const response = await axios.get(url)
	return response.data
}

async function addCartoonToDb(cartoon) {
	console.log('Submitting cartoon to dynamodb', cartoon)
	const tableName = process.env.CARTOON_TABLE
		? process.env.CARTOON_TABLE
		: 'cartoons'
	return await dynamoDbClient.put({ tableName: tableName, item: cartoon })
}

function extractImageUrlFromMeta(data) {
	let matched = data.match(/<meta property="og:image" content="(.*)"/)
	if (matched && matched.length > 1) {
		console.log('extracted ', matched[1])
		return matched[1]
	}
	throw new Error('did not match!')
}

function createCartoon(name, url) {
	return {
		name: name,
		lastImageUrl: url,
	}
}
