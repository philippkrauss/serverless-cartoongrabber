const axios = require('axios')

function extractImageUrlFromMeta(data) {
    let matched = data.match(/<meta property="og:image" content="(.*)">/)
    if (matched && matched.length > 1) {
        return matched[1]
    }
}

module.exports.grab = async (event, context, cb) => {
    let responseBody
    try {
        const response = await axios.get('https://www.ruthe.de')
        responseBody = extractImageUrlFromMeta(response.data)
    } catch (error) {
        responseBody = 'nothing found'
    }
    cb(null, {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain'
        },
        body: responseBody
    })
}
