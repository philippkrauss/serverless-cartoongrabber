const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
	entry: {
		grab: './src/grabber.js',
		report: './src/reporter.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]/index.js',
		library: {
			type: 'commonjs',
		},
	},
	target: 'node',
	devtool: 'source-map',
	plugins: [new CleanWebpackPlugin()],
}
