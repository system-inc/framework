// Class
class Json {

    static is(value) {
        var is = false;

        if(String.is(value)) {
            try {
                var object = Json.parse(value);

                // Handle non-exception-throwing cases:
                // Neither Json.parse(false) or Json.parse(1234) throw errors, hence the type-checking,
                // but Json.parse(null) returns 'null', and typeof(null) === "object", so we must check for that, too.
                if(object && typeof(object) === "object" && object !== null) {
                    is = true;
                }
            }
            catch(exception) {
            }
        }

        return is;
    }

    static encode(object, replacer, indentation) {
        if(!object) {
            return '';
        }

        //return Node.Utility.inspect(object);
        return JSON.stringify(Json.decycle(object), replacer, indentation);
    }

    static decode(string) {
        if(!string) {
            return null;
        }

        return Json.parse(string);
    }

    static indent(object, replacer, indentation = 4) {
        var indentedJson = Json.encode(object, replacer, indentation);

        return indentedJson;
    }

    static escape(jsonString) {

    }

    /*
        Make a deep copy of an object or array, assuring that there is at most one instance of each object or array in the resulting structure.
        The duplicate references (which might be forming cycles) are replaced with an object of the form

            {$reference: PATH}

        where the PATH is a JSONPath string that locates the first occurance. So,

            var a = [];
            a[0] = a;
            return JSON.stringify(Json.decycle(a));

        produces the string

            '[{"$reference":"$"}]'.

        JSONPath is used to locate the unique object. $ indicates the top level of the object or array. [NUMBER] or [STRING] indicates a child member or property.
    */
    static decycle(objectToDecycle) {
        var objects = []; // Keep a reference to each unique object or array
        var paths = []; // Keep the path to each unique object or array

        // The decycle function recurses through the object, producing the deep copy
        return (function decycle(value, path) {
            var i; // The loop counter
            var key; // Property name
            var decycledValue; // The new object or array

            // typeof null === 'object', so go on if this value is really an object but not one of the weird builtin objects
            if(
                typeof value === 'object' &&
                value !== null &&
                !(value instanceof Boolean) &&
                !(value instanceof Date) &&
                !(value instanceof Number) &&
                !(value instanceof RegExp) &&
                !(value instanceof String)
            ) {
                // If the value is an object or array, look to see if we have already encountered it
                for(i = 0; i < objects.length; i += 1) {
                    // If so, return a $reference/path object
                    if(objects[i] === value) {
                        return {
                            $reference: paths[i]
                        };
                    }
                }

                // Otherwise, accumulate the unique value and its path
                objects.append(value);
                paths.append(path);

                // If it is an array, replicate the array
                if(Object.prototype.toString.apply(value) === '[object Array]') {
                    decycledValue = [];
                    for(i = 0; i < value.length; i += 1) {
                        decycledValue[i] = decycle(value[i], path + '[' + i + ']');
                    }
                }
                // Call .toString all Buffer objects to prevent a giant string of buffer content in output
                else if(typeof Buffer !== 'undefined' && value instanceof Buffer) {
                    decycledValue = value.toString();
                }
                // If it is an object, replicate the object
                else {
                    decycledValue = {};
                    for(key in value) {
                        if(Object.prototype.hasOwnProperty.call(value, key)) {
                            decycledValue[key] = decycle(value[key], path + '[' + JSON.stringify(key) + ']');
                        }
                    }
                }

                return decycledValue;
            }
            // Show regular expressions as strings
            // TODO: This probably breaks retrocycling any JSON object that contains a regular expression
            else if(value instanceof RegExp) {
                return value.toString()+' (RegularExpression)';
            }

            return value;
        }(objectToDecycle, '$'));
    }

    /*
        Restore an object that was reduced by decycle. Members whose values are objects of the form

            {$reference: PATH}

        are replaced with references to the value found by the PATH. This will restore cycles. The object will be mutated.

        The eval function is used to locate the values described by a PATH. The root object is kept in a $ variable. A regular expression is used to
        assure that the PATH is extremely well formed. The regexp contains nested * quantifiers. That has been known to have extremely bad performance
        problems on some browsers for very long strings. A PATH is expected to be reasonably short. A PATH is allowed to belong to a very restricted
        subset of Goessner's JSONPath.

        So,

            var s = '[{"$reference":"$"}]';
            return Json.retrocycle(Json.parse(s));

        produces an array containing a single element which is the array itself.
    */
    static retrocycle($) {
        var wellFormedPathRegularExpression = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

        (function retrocycle(value) {
            // The retrocycle function walks recursively through the object looking for $reference properties
            // When it finds one that has a value that is a path, then it replaces the $reference object with a reference to the value that is found by the path
            var i;
            var item;
            var name;
            var path;

            if(value && typeof value === 'object') {
                if(Object.prototype.toString.apply(value) === '[object Array]') {
                    for(i = 0; i < value.length; i += 1) {
                        item = value[i];
                        if(item && typeof item === 'object') {
                            path = item.$reference;
                            if(typeof path === 'string' && wellFormedPathRegularExpression.test(path)) {
                                value[i] = eval(path);
                            }
                            else {
                                retrocycle(item);
                            }
                        }
                    }
                }
                else {
                    for(name in value) {
                        if(typeof value[name] === 'object') {
                            item = value[name];
                            if(item) {
                                path = item.$reference;
                                if(typeof path === 'string' && wellFormedPathRegularExpression.test(path)) {
                                    value[name] = eval(path);
                                }
                                else {
                                    retrocycle(item);
                                }
                            }
                        }
                    }
                }
            }
        }($));

        return $;
    }

    // https://github.com/aseemk/json5
    static parse = (function() {
       // This is a function that can parse a JSON5 text, producing a JavaScript
       // data structure. It is a simple, recursive descent parser. It does not use
       // eval or regular expressions, so it can be used as a model for implementing
       // a JSON5 parser in other languages.

       // We are defining the function inside of another function to avoid creating
       // global variables.

       var at,     // The index of the current character
           ch,     // The current character
           escapee = {
               "'":  "'",
               '"':  '"',
               '\\': '\\',
               '/':  '/',
               '\n': '',       // Replace escaped newlines in strings w/ empty string
               b:    '\b',
               f:    '\f',
               n:    '\n',
               r:    '\r',
               t:    '\t'
           },
           ws = [
               ' ',
               '\t',
               '\r',
               '\n',
               '\v',
               '\f',
               '\xA0',
               '\uFEFF'
           ],
           text,

           error = function (m) {

               // Call error when something is wrong.

               var error = new SyntaxError();
               error.message = m;
               error.at = at;
               error.text = text;
               throw error;
           },

           next = function (c) {

               // If a c parameter is provided, verify that it matches the current character.

               if (c && c !== ch) {
                   error("Expected '" + c + "' instead of '" + ch + "'");
               }

               // Get the next character. When there are no more characters,
               // return the empty string.

               ch = text.charAt(at);
               at += 1;
               return ch;
           },

           peek = function () {

               // Get the next character without consuming it or
               // assigning it to the ch varaible.

               return text.charAt(at);
           },

           identifier = function () {

               // Parse an identifier. Normally, reserved words are disallowed here, but we
               // only use this for unquoted object keys, where reserved words are allowed,
               // so we don't check for those here. References:
               // - http://es5.github.com/#x7.6
               // - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
               // - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
               // TODO Identifiers can have Unicode "letters" in them; add support for those.

               var key = ch;

               // Identifiers must start with a letter, _ or $.
               if ((ch !== '_' && ch !== '$') &&
                       (ch < 'a' || ch > 'z') &&
                       (ch < 'A' || ch > 'Z')) {
                   error("Bad identifier");
               }

               // Subsequent characters can contain digits.
               while (next() && (
                       ch === '_' || ch === '$' ||
                       (ch >= 'a' && ch <= 'z') ||
                       (ch >= 'A' && ch <= 'Z') ||
                       (ch >= '0' && ch <= '9'))) {
                   key += ch;
               }

               return key;
           },

           number = function () {

               // Parse a number value.

               var number,
                   sign = '',
                   string = '',
                   base = 10;

               if (ch === '-' || ch === '+') {
                   sign = ch;
                   next(ch);
               }

               // support for Infinity (could tweak to allow other words):
               if (ch === 'I') {
                   number = word();
                   if (typeof number !== 'number' || isNaN(number)) {
                       error('Unexpected word for number');
                   }
                   return (sign === '-') ? -number : number;
               }

               // support for NaN
               if (ch === 'N' ) {
                 number = word();
                 if (!isNaN(number)) {
                   error('expected word to be NaN');
                 }
                 // ignore sign as -NaN also is NaN
                 return number;
               }

               if (ch === '0') {
                   string += ch;
                   next();
                   if (ch === 'x' || ch === 'X') {
                       string += ch;
                       next();
                       base = 16;
                   } else if (ch >= '0' && ch <= '9') {
                       error('Octal literal');
                   }
               }

               switch (base) {
               case 10:
                   while (ch >= '0' && ch <= '9' ) {
                       string += ch;
                       next();
                   }
                   if (ch === '.') {
                       string += '.';
                       while (next() && ch >= '0' && ch <= '9') {
                           string += ch;
                       }
                   }
                   if (ch === 'e' || ch === 'E') {
                       string += ch;
                       next();
                       if (ch === '-' || ch === '+') {
                           string += ch;
                           next();
                       }
                       while (ch >= '0' && ch <= '9') {
                           string += ch;
                           next();
                       }
                   }
                   break;
               case 16:
                   while (ch >= '0' && ch <= '9' || ch >= 'A' && ch <= 'F' || ch >= 'a' && ch <= 'f') {
                       string += ch;
                       next();
                   }
                   break;
               }

               if(sign === '-') {
                   number = -string;
               } else {
                   number = +string;
               }

               if (!isFinite(number)) {
                   error("Bad number");
               } else {
                   return number;
               }
           },

           string = function () {

               // Parse a string value.

               var hex,
                   i,
                   string = '',
                   delim,      // double quote or single quote
                   uffff;

               // When parsing for string values, we must look for ' or " and \ characters.

               if (ch === '"' || ch === "'") {
                   delim = ch;
                   while (next()) {
                       if (ch === delim) {
                           next();
                           return string;
                       } else if (ch === '\\') {
                           next();
                           if (ch === 'u') {
                               uffff = 0;
                               for (i = 0; i < 4; i += 1) {
                                   hex = parseInt(next(), 16);
                                   if (!isFinite(hex)) {
                                       break;
                                   }
                                   uffff = uffff * 16 + hex;
                               }
                               string += String.fromCharCode(uffff);
                           } else if (ch === '\r') {
                               if (peek() === '\n') {
                                   next();
                               }
                           } else if (typeof escapee[ch] === 'string') {
                               string += escapee[ch];
                           } else {
                               break;
                           }
                       } else if (ch === '\n') {
                           // unescaped newlines are invalid; see:
                           // https://github.com/aseemk/json5/issues/24
                           // TODO this feels special-cased; are there other
                           // invalid unescaped chars?
                           break;
                       } else {
                           string += ch;
                       }
                   }
               }
               error("Bad string");
           },

           inlineComment = function () {

               // Skip an inline comment, assuming this is one. The current character should
               // be the second / character in the // pair that begins this inline comment.
               // To finish the inline comment, we look for a newline or the end of the text.

               if (ch !== '/') {
                   error("Not an inline comment");
               }

               do {
                   next();
                   if (ch === '\n' || ch === '\r') {
                       next();
                       return;
                   }
               } while (ch);
           },

           blockComment = function () {

               // Skip a block comment, assuming this is one. The current character should be
               // the * character in the /* pair that begins this block comment.
               // To finish the block comment, we look for an ending */ pair of characters,
               // but we also watch for the end of text before the comment is terminated.

               if (ch !== '*') {
                   error("Not a block comment");
               }

               do {
                   next();
                   while (ch === '*') {
                       next('*');
                       if (ch === '/') {
                           next('/');
                           return;
                       }
                   }
               } while (ch);

               error("Unterminated block comment");
           },

           comment = function () {

               // Skip a comment, whether inline or block-level, assuming this is one.
               // Comments always begin with a / character.

               if (ch !== '/') {
                   error("Not a comment");
               }

               next('/');

               if (ch === '/') {
                   inlineComment();
               } else if (ch === '*') {
                   blockComment();
               } else {
                   error("Unrecognized comment");
               }
           },

           white = function () {

               // Skip whitespace and comments.
               // Note that we're detecting comments by only a single / character.
               // This works since regular expressions are not valid JSON(5), but this will
               // break if there are other valid values that begin with a / character!

               while (ch) {
                   if (ch === '/') {
                       comment();
                   } else if (ws.indexOf(ch) >= 0) {
                       next();
                   } else {
                       return;
                   }
               }
           },

           word = function () {

               // true, false, or null.

               switch (ch) {
               case 't':
                   next('t');
                   next('r');
                   next('u');
                   next('e');
                   return true;
               case 'f':
                   next('f');
                   next('a');
                   next('l');
                   next('s');
                   next('e');
                   return false;
               case 'n':
                   next('n');
                   next('u');
                   next('l');
                   next('l');
                   return null;
               case 'I':
                   next('I');
                   next('n');
                   next('f');
                   next('i');
                   next('n');
                   next('i');
                   next('t');
                   next('y');
                   return Infinity;
               case 'N':
                 next( 'N' );
                 next( 'a' );
                 next( 'N' );
                 return NaN;
               }
               error("Unexpected '" + ch + "'");
           },

           value,  // Place holder for the value function.

           array = function () {

               // Parse an array value.

               var array = [];

               if (ch === '[') {
                   next('[');
                   white();
                   while (ch) {
                       if (ch === ']') {
                           next(']');
                           return array;   // Potentially empty array
                       }
                       // ES5 allows omitting elements in arrays, e.g. [,] and
                       // [,null]. We don't allow this in JSON5.
                       if (ch === ',') {
                           error("Missing array element");
                       } else {
                           array.append(value());
                       }
                       white();
                       // If there's no comma after this value, this needs to
                       // be the end of the array.
                       if (ch !== ',') {
                           next(']');
                           return array;
                       }
                       next(',');
                       white();
                   }
               }
               error("Bad array");
           },

           object = function () {

               // Parse an object value.

               var key,
                   object = {};

               if (ch === '{') {
                   next('{');
                   white();
                   while (ch) {
                       if (ch === '}') {
                           next('}');
                           return object;   // Potentially empty object
                       }

                       // Keys can be unquoted. If they are, they need to be
                       // valid JS identifiers.
                       if (ch === '"' || ch === "'") {
                           key = string();
                       } else {
                           key = identifier();
                       }

                       white();
                       next(':');
                       object[key] = value();
                       white();
                       // If there's no comma after this pair, this needs to be
                       // the end of the object.
                       if (ch !== ',') {
                           next('}');
                           return object;
                       }
                       next(',');
                       white();
                   }
               }
               error("Bad object");
           };

       value = function () {

           // Parse a JSON value. It could be an object, an array, a string, a number,
           // or a word.

           white();
           switch (ch) {
           case '{':
               return object();
           case '[':
               return array();
           case '"':
           case "'":
               return string();
           case '-':
           case '+':
           case '.':
               return number();
           default:
               return ch >= '0' && ch <= '9' ? number() : word();
           }
       };

       // Return the json_parse function. It will have access to all of the above
       // functions and variables.

       return function (source, reviver) {
           var result;

           text = String(source);
           at = 0;
           ch = ' ';
           result = value();
           white();
           if (ch) {
               error("Syntax error");
           }

           // If there is a reviver function, we recursively walk the new structure,
           // passing each name/value pair to the reviver function for possible
           // transformation, starting with a temporary root object that holds the result
           // in an empty key. If there is not a reviver function, we simply return the
           // result.

           return typeof reviver === 'function' ? (function walk(holder, key) {
               var k, v, value = holder[key];
               if (value && typeof value === 'object') {
                   for (k in value) {
                       if (Object.prototype.hasOwnProperty.call(value, k)) {
                           v = walk(value, k);
                           if (v !== undefined) {
                               value[k] = v;
                           } else {
                               delete value[k];
                           }
                       }
                   }
               }
               return reviver.call(holder, key, value);
           }({'': result}, '')) : result;
       };
    }());

}

// Global
global.Json = Json;
