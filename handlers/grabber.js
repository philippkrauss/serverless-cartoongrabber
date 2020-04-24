import axios from 'axios'

function extractImageUrlFromMeta(data) {
    let matched = data.match(/<meta property="og:image" content="(.*)">/)
    if (matched && matched.length > 1) {
        return matched[1]
    }
}

//TODO use async/await
export const grab = (event, context, cb) => {
    axios.get('https://www.ruthe.de').then((response) => {
        const url = extractImageUrlFromMeta(response.data)
        cb(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: url
        })
    }).catch((error) => {
        cb(null, {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: 'Nothing found'
        })
    })
};
