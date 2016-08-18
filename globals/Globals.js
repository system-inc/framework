// Transpiler
Transpiler = require('./custom/Transpiler.js');

// Node
Node = require('./globals/node/Node.js');
Buffer = require('./globals/node/Buffer.js');
Stream = require('./globals/node/Stream.js');

// Standard
Array = require('./globals/standard/Array.js');
Boolean = require('./globals/standard/Boolean.js');
Function = require('./globals/standard/Function.js');
Object = require('./globals/standard/Object.js');
Promise = require('./globals/standard/Promise.js');
RegularExpression = require('./globals/standard/RegularExpression.js');

// Custom
Class = require('./globals/custom/Class.js');
Generator = require('./globals/custom/Generator.js');
Json = require('./globals/custom/Json.js');
Primitive = require('./globals/custom/Primitive.js');
Try = require('./globals/custom/Try.js');
App = require('./globals/custom/App.js');
Time = require('./globals/custom/Time.js');

// Standard - depend on Class
Error = require('./globals/standard/errors/Error.js');

// Standard - depend on Generator
Number = require('./globals/standard/Number.js');
String = require('./globals/standard/String.js');

// Other
Console = require('./system/console/Console.js');