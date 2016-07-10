// Class
var RegularExpression = RegExp; // use RegExp

// Static methods

RegularExpression.is = function(value) {
	return value instanceof RegExp;
};

RegularExpression.equal = function(x, y) {
    return (x instanceof RegExp) && (y instanceof RegExp) && 
           (x.source === y.source) && (x.global === y.global) && 
           (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline);
}

RegularExpression.escape = function(string) {
	if(Number.is(string)) {
		string = ''+string;
	}

	return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

RegularExpression.wildcardPatternsMatch = function(wildcardPatternA, wildcardPatternB) {
	//console.log('wildcardPatternsMatch', wildcardPatternA, wildcardPatternB);

	// Handle exact matches
	if(wildcardPatternA === wildcardPatternB) {
		return true;
	}

	// Make "event1" match "event1.*"
	if(wildcardPatternA.endsWith('.*')) {
        wildcardPatternA = wildcardPatternA.slice(0, -2)+'*';
		//wildcardPatternA = wildcardPatternA.replaceLast('.*', '*');
	}
	if(wildcardPatternB.endsWith('.*')) {
        wildcardPatternB = wildcardPatternB.slice(0, -2)+'*';
		//wildcardPatternB = wildcardPatternB.replaceLast('.*', '*');
	}

	// Handle exact matches again
	if(wildcardPatternA === wildcardPatternB) {
		return true;
	}
    
    function nextToken(string) {
        if(string.length == 0) {
            return ['END', null, 1];
        }
        if(string[0] == '\\') {
            if(string.length == 1) {
                throw 'Cannot read next token after backslash, string too short';
            }
            return ['LITERAL', string[1], 2];
        }
        if(string[0] == '*') {
            return ['WILD', null, 1];
        }
        if(string[0] == '?') {
            return ['ONE_WILD', null, 1];
        }
        if(string[0] == '(') {
            return ['START_GROUP', null, 1];
        }
        if(string[0] == '|') {
            return ['GROUP_DELIMITER', null, 1];
        }
        if(string[0] == ')') {
            return ['END_GROUP', null, 1];
        }
        if(string[0] == '[') {
            return ['START_SET', null, 1];
        }
        if(string[0] == ']') {
            return ['END_SET', null, 1];
        }
        if(string[0] == '-') {
            return ['RANGE', null, 1];
        }

        return ['LITERAL', string[0], 1];
    }

    function readSet(string) {
        var set = {
            values: [],
            read: 0
        };

        while(true) {
            var token = nextToken(string);
            string = string.substr(token[2]);
            set.read += token[2];

            if(token[0] == 'END_SET') {
                set.remainder = string;
                //console.log(set);
                return set;
            }
            else if(token[0] == 'LITERAL') {
                set.values.push(token[1]);
            }
            else {
                console.error(wildcardPatternA, wildcardPatternB);
                console.error('Invalid token in set: '+token[0]);
            }
        }
    }

    function readGroup(string) {
        var group = {
            options: []
        };

        var option = '';
        while(true) {
            var token = nextToken(string);
            var character = string.substr(0, token[2]);
            string = string.substr(token[2]);

            if(token[0] == 'END_GROUP') {
                group.options.push(option);
                group.remainder = string;
                return group;
            }
            else if(token[0] == 'GROUP_DELIMITER') {
                group.options.push(option);
                option = '';
            }
            else if(token[0] == 'END') {
                throw "Unexpected end of string while parsing group options";
            }
            else {
                option += character;
            }
        }
    }
    
    while(true) {
        var tokenA = nextToken(wildcardPatternA);
        var tokenB = nextToken(wildcardPatternB);
        //console.log(tokenA, tokenB);
        //console.log(wildcardPatternA, wildcardPatternB);

        if(tokenA[0] == 'LITERAL' && tokenB[0] == 'LITERAL') {
            if(tokenA[1] != tokenB[1]) {
                //console.log('LITERAL', tokenA[1], '!=', tokenB[1]);
                return false;
            }
            wildcardPatternA = wildcardPatternA.substr(1);
            wildcardPatternB = wildcardPatternB.substr(1);
            continue;
        }

        if(tokenA[0] == 'WILD') {
            wildcardPatternA = wildcardPatternA.substr(1);
            var i = 0;
            while(i <= wildcardPatternB.length) {
                //console.log(wildcardPatternA, wildcardPatternB.substr(i));
                var result = RegularExpression.wildcardPatternsMatch(wildcardPatternA, wildcardPatternB.substr(i));
                if(result) {
                    return true;
                }
                var token = nextToken(wildcardPatternB.substr(i));
                if(token[0] == 'LITERAL' || token[0] == 'WILD' || token[0] == 'ONE_WILD') {
                    i += token[2];
                }
                else if(token[0] == 'START_SET') {
                    i++;
                var set = readSet(wildcardPatternB.substr(i));
                    i += set.read;
                }
                else {
                    //console.log(wildcardPatternB, wildcardPatternA);
                    //console.log("NEED TO SKIP NON-LITERAL (A)" + token[0]);
                    return false;
                }
            }
            return false;
        }

        if(tokenB[0] == 'WILD') {
            wildcardPatternB = wildcardPatternB.substr(1);

            var i = 0;
            while(i <= wildcardPatternA.length) {
                var result = RegularExpression.wildcardPatternsMatch(wildcardPatternB, wildcardPatternA.substr(i));
                if(result) {
                    return true;
                }
                var token = nextToken(wildcardPatternA.substr(i));
                if(token[0] == 'LITERAL' || token[0] == 'WILD') {
                    i += token[2];
                }
                else if(token[0] == 'START_SET') {
                    i++;
                    var set = readSet(wildcardPatternA.substr(i));
                    i += set.read;
                }
                else {
                    //console.log("NEED TO SKIP NON-LITERAL (B)");
                    return false;
                }
            }
            return false;
        }

        if(tokenA[0] == 'ONE_WILD') {
            if(tokenB[0] == 'LITERAL' || tokenB[0] == 'ONE_WILD') {
                wildcardPatternA = wildcardPatternA.substr(1);
                wildcardPatternB = wildcardPatternB.substr(tokenB[2]);
                continue;
            }
            else if(tokenB[0] == 'START_SET') {
                wildcardPatternA = wildcardPatternA.substr(1);
                wildcardPatternB = wildcardPatternB.substr(1);
                var set = readSet(wildcardPatternB);
                wildcardPatternB = set.remainder;
                continue;
            }
            else if(tokenB[0] == 'WILD') {
                wildcardPatternA = wildcardPatternA.substr(1);
                //console.log(wildcardPatternA, wildcardPatternB);
                wildcardPatternB = wildcardPatternB.substr(1);
                //console.log(wildcardPatternA, wildcardPatternB);
                var i = 0;
                while(i <= wildcardPatternA.length) {
                    var result = RegularExpression.wildcardPatternsMatch(wildcardPatternB, wildcardPatternA.substr(i));
                    if(result) {
                        return true;
                    }
                    var token = nextToken(wildcardPatternA.substr(i));
                    if(token[0] == 'LITERAL' || token[0] == 'WILD') {
                        i += token[2];
                    }
                    else if(token[0] == 'START_SET') {
                        i++;
                        var set = readSet(wildcardPatternA.substr(i));
                        i += set.read;
                    }
                    else {
                        //console.log("NEED TO SKIP NON-LITERAL (B)");
                        return false;
                    }
                }
                return false;
            }
            //console.log(wildcardPatternA, wildcardPatternB);
            //console.log('ONE_WILD (A) COMPARE TO NON-LITERAL', tokenB[0]);
            return false;
        }

        if(tokenB[0] == 'ONE_WILD') {
            //console.log(wildcardPatternA, wildcardPatternB);
            wildcardPatternB = wildcardPatternB.substr(1);
            if(tokenA[0] == 'LITERAL' || tokenA[0] == 'ONE_WILD') {
                wildcardPatternA = wildcardPatternA.substr(1);
                continue;
            }
            //console.log(wildcardPatternA, wildcardPatternB);
            //console.log('ONE_WILD (B) COMPARE TO NON-LITERAL', tokenA[0]);
            return false;
        }

        if(tokenA[0] == 'START_SET') {
            wildcardPatternA = wildcardPatternA.substr(1);
            var setA = readSet(wildcardPatternA);
            wildcardPatternA = setA.remainder;
            if(tokenB[0] == 'LITERAL') {
                if(setA.values.indexOf(tokenB[1]) != -1) {
                    wildcardPatternB = wildcardPatternB.substr(tokenB[2]);
                    continue;
                }
                return false;
            }
            if(tokenB[0] == 'START_SET') {
                wildcardPatternB = wildcardPatternB.substr(1);
                var setB = readSet(wildcardPatternB);
                wildcardPatternB = setA.remainder;
                //console.log(setA, setB);
                var found = false;
                for(var i = 0; i < setA.values.length; i++) {
                    for(var j = 0; j < setB.values.length; j++) {
                        if(setA.values[i] == setB.values[j]) {
                            found = true;
                            break;
                        }
                    }
                }
                if(found) {
                    continue;
                }
                return false;
            }
            //console.log(wildcardPatternA, wildcardPatternB);
            //console.log("COMPARE SET (A) TO " + tokenB[0]);
            return false;
        }

        if(tokenB[0] == 'START_SET') {
            wildcardPatternB = wildcardPatternB.substr(1);
            var setB = readSet(wildcardPatternB);
            wildcardPatternB = setB.remainder;

            if(tokenA[0] == 'LITERAL') {
                if(setB.values.indexOf(tokenA[1]) != -1) {
                    wildcardPatternA = wildcardPatternA.substr(1);
                    continue;
                }
                return false;
            }
            //console.log("COMPARE SET (B) TO " + tokenA[0]);
            return false;
        }

        if(tokenA[0] == 'START_GROUP') {
            wildcardPatternA = wildcardPatternA.substr(1);
            var groupA = readGroup(wildcardPatternA);
            wildcardPatternA = groupA.remainder;
            //console.log(groupA);

            for(var i = 0; i < groupA.options.length; i++) {
                var result = RegularExpression.wildcardPatternsMatch(groupA.options[i] + wildcardPatternA, wildcardPatternB);
                if(result) {
                    return true;
                }
            }

            return false;
        }

        if(tokenA[0] == 'END' || tokenB[0] == 'END') {
            return tokenA[0] == 'END' && tokenB[0] == 'END';
        }

        //console.log(wildcardPatternA, wildcardPatternB);
        //console.log("Unexpected token: " + tokenA + '-' + tokenB);
        return false;
    }
};

// Export
module.exports = RegularExpression;