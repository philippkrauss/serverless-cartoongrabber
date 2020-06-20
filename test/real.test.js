const grabber = require('../src/grabber')

test('really', async () => {
	const source = grabber.SOURCES[4]
	const cartoon = await source.grabber(source)
	console.log(cartoon)
})
