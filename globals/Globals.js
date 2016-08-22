// Make sure global variable is set
if(!global && window) {
	global = window;
}

// Show unhandled errors
process.on('unhandledRejection', function(error) {
	console.log('Unhandled rejection:', error);
});

// Node
import './node/Node.js';
import './node/Buffer.js';
import './node/Stream.js';

// Standard
import './standard/Array.js';
import './standard/Boolean.js';
//import './standard/errors/Error.js';
import './standard/Function.js';
import './standard/Number.js';
import './standard/Object.js';
import './standard/Promise.js';
import './standard/RegularExpression.js';
import './standard/String.js';

// Custom
import './custom/Class.js';
import './custom/Generator.js';
import './custom/Json.js';
import './custom/Primitive.js';
import './custom/Time.js';
