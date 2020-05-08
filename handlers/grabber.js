const axios = require('axios')
const dynamodb = require('serverless-dynamodb-client');

const docClient = dynamodb.doc;

//TODO logging?
module.exports.grab = async (event, context, cb) => {
    try {
        const response = await axios.get('https://www.ruthe.de')
        const url = extractImageUrlFromMeta(response.data)
        // await addCartoonToDb({
        //     name: 'ruthe',
        //     lastImageUrl: url,
        // })
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
            })
        }
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: error
            })
        }
    }
}

async function addCartoonToDb(cartoon) {
    console.log('Submitting cartoon');
    const tableName = process.env.CARTOON_TABLE ? process.env.CARTOON_TABLE : 'cartoons'
    return await docClient.put({
        TableName: tableName,
        Item: cartoon,
    }).promise()
}

function extractImageUrlFromMeta(data) {
    let matched = data.match(/<meta property="og:image" content="(.*)">/)
    if (matched && matched.length > 1) {
        return matched[1]
    }
}
