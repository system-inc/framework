// Add functionality to standard JavaScript classes (order of import matters)
import '@framework/globals/standard/Promise.js';
import '@framework/globals/standard/Number.js';
import '@framework/globals/standard/RegularExpression.js';
import '@framework/globals/standard/String.js';
import '@framework/globals/standard/Array.js';
import '@framework/globals/standard/Boolean.js';
import '@framework/globals/standard/errors/Error.js';
import '@framework/globals/standard/Function.js';
import '@framework/globals/standard/Object.js';

// Create Framework custom global classes
import '@framework/globals/custom/Class.js';
import '@framework/globals/custom/Json.js';
import '@framework/globals/custom/Primitive.js';
import '@framework/globals/custom/Time.js';
import '@framework/globals/custom/Decorators.js';
