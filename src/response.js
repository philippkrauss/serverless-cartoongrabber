module.exports.createResponse = (body) => {
	return createJsonResponse(200, body)
}

module.exports.createErrorResponse = (body) => {
	return createJsonResponse(500, body)
}

function createJsonResponse(statusCode, body) {
	return {
		statusCode: statusCode,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}
}
