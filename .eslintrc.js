module.exports = {
	env: {
		jest: true,
		node: true,
		commonjs: true,
		es6: true,
	},
	plugins: ['prettier'],
	rules: {
		'prettier/prettier': 'error',
	},
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 11,
	},
}
