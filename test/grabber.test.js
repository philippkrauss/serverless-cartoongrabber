const grabber = require('../src/grabber');
const axios = require('axios')

jest.mock('axios')

test('grab', async () => {
    const HTML_CONTENT = '<meta property="og:image" content="some-cartoon-url.jpg">'
    const axiosGetStub = axios.get.mockResolvedValue({data: HTML_CONTENT})

    const response = await grabber.grab(null, null)
    expect(response.body).toBe("{\"url\":\"some-cartoon-url.jpg\"}")
    expect(axiosGetStub.mock.calls[0][0]).toEqual(
        'https://www.ruthe.de'
    )
})

