// Make sure global is set
if(!global && window) {
	global = window;
}

// Node
import Node from './node/Node.js';
import Buffer from './node/Buffer.js';
import Stream from './node/Stream.js';

// Standard
import Array from './standard/Array.js';
import Boolean from './standard/Boolean.js';
import Function from './standard/Function.js';
//import Object from './standard/Object.js';
import Promise from './standard/Promise.js';
import RegularExpression from './standard/RegularExpression.js';
import String from './standard/String.js';

// Custom
import Class from './custom/Class.js';
//import Generator from './custom/Generator.js';
//import Json from './custom/Json.js';
//Primitive = require('./custom/Primitive.js');
//App = require('./custom/App.js');
//Time = require('./custom/Time.js');

//// Standard - depend on Class
//Error = require('./standard/errors/Error.js');

//// Standard - depend on Generator
//Number = require('./standard/Number.js');


//// Other
//Console = require('./system/console/Console.js');