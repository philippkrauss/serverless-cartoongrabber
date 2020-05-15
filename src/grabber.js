const axios = require('axios')
const dynamoDbClient = require('./dynamoDbClient')

//TODO logging?
module.exports.grab = async (event, context, cb) => {
    const source = {
        url: 'https://www.ruthe.de',
        name: 'ruthe'
    }
    try {
        const websiteText = await getWebsiteText(source.url)
        const url = extractImageUrlFromMeta(websiteText)
        const cartoon = createCartoon(source.name, url)
        await addCartoonToDb(cartoon)
        return createResponse({
            url: url,
        })
    } catch (error) {
        return createErrorResponse({
            error: error
        })
    }
}

async function getWebsiteText(url) {
    const response = await axios.get(url)
    return response.data
}
async function addCartoonToDb(cartoon) {
    console.log('Submitting cartoon');
    const tableName = process.env.CARTOON_TABLE ? process.env.CARTOON_TABLE : 'cartoons'
    return await dynamoDbClient.put({tableName: tableName, item: cartoon})
}
function extractImageUrlFromMeta(data) {
    let matched = data.match(/<meta property="og:image" content="(.*)">/)
    if (matched && matched.length > 1) {
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
function createResponse(body) {
    return createJsonResponse(200, body)
}
function createErrorResponse(body) {
    return createJsonResponse(500, body)
}
function createJsonResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}
