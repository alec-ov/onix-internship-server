module.exports = {
	"env": {
		"node": true,
		"commonjs": false,
		"es2021": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	//"parser": "babel-eslint",
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"max-len": [
			"error",
			{
				"code": 130
			}
		]
	}
};
