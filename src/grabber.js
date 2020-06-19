const axios = require('axios')
const response = require('./response')
const dynamoDbClient = require('./dynamoDbClient')

/* eslint-disable no-unused-vars */
module.exports.grab = async (event, context) => {
	/* eslint-enable */
	const source = {
		url: 'https://www.ruthe.de',
		name: 'ruthe',
	}
	try {
		const websiteText = await getWebsiteText(source.url)
		const url = extractImageUrlFromMeta(websiteText)
		const cartoon = createCartoon(source.name, url)
		await addCartoonToDb(cartoon)
		return response.createResponse({
			url: url,
		})
	} catch (error) {
		console.error('an error occurred', error)
		return response.createErrorResponse({
			error: error,
		})
	}
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
	let matched = data.match(/<meta property="og:image" content="(.*)">/)
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
