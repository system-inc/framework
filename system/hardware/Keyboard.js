// Class
var Keyboard = Class.extend({
	
});

// Static properties

Keyboard.keyTitleMap = {
	'~': 'tilde',
	'`': 'graveAccent',

	'!': 'exclamation',
	'@': 'at',
	'#': 'number',
	'$': 'dollar',
	'%': 'percent',
	'^': 'caret',
	'&': 'ampersand',
	'*': 'asterisk',
	'(': 'leftParenthesis',
	')': 'rightParenthesis',

	'-': 'minus',
	'_': 'underscore',
	'=': 'equals',
	'+': 'plus',

	'[': 'leftBracket',
	'{': 'leftBrace',
	']': 'rightBracket',
	'}': 'rightBrace',
	'\\': 'backslash',
	'|': 'verticalBar',

	';': 'semicolon',
	':': 'colon',
	'\'': 'singleQuote',
	'"': 'doubleQuote',

	',': 'comma',
	'<': 'lessThan',
	'.': 'period',
	'>': 'moreThan',
	'/': 'forwardSlash',
	'?': 'question',

	' ': 'space',

	'meta': (Project.onWindows() ? 'windows' : (Project.onMacOs() ? 'command' : 'meta')),

	'arrowUp': 'up',
	'arrowDown': 'down',
	'arrowLeft': 'left',
	'arrowRight': 'right',
};

// Export
module.exports = Keyboard;