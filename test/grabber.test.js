const grabber = require('../handlers/grabber');
const axios = require('axios')

jest.mock('axios')

test('grab', done => {
    const HTML_CONTENT = '<meta property="og:image" content="some-cartoon-url.jpg">'
    const axiosGetStub = axios.get.mockResolvedValue({data: HTML_CONTENT})
    grabber.grab(null, null, (err, response) => {
        expect(response.body).toBe('some-cartoon-url.jpg')
        expect(axiosGetStub.mock.calls[0][0]).toEqual(
			'https://www.ruthe.de'
		)
        done()
    })
})

