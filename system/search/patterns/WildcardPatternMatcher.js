// Class
var WildcardPatternMatcher = {};

// Static methods

// Tokens are [token type, characters, ]
WildcardPatternMatcher.nextToken = function(string) {
    if(string.length == 0) {
        return ['END', null, 1];
    }

    var firstCharacter = string[0];

    if(firstCharacter == '\\') {
        if(string.length == 1) {
            throw 'Cannot read next token after backslash, provided string is too short.';
        }
        return ['LITERAL', string[1], 2];
    }
    if(firstCharacter == '*') {
        return ['WILD', null, 1];
    }
    if(firstCharacter == '?') {
        return ['ONE_WILD', null, 1];
    }
    if(firstCharacter == '(') {
        return ['START_GROUP', null, 1];
    }
    if(firstCharacter == '|') {
        return ['GROUP_DELIMITER', null, 1];
    }
    if(firstCharacter == ')') {
        return ['END_GROUP', null, 1];
    }
    if(firstCharacter == '[') {
        return ['START_SET', null, 1];
    }
    if(firstCharacter == ']') {
        return ['END_SET', null, 1];
    }
    if(firstCharacter == '-') {
        return ['RANGE', null, 1];
    }

    return ['LITERAL', firstCharacter, 1];
};

WildcardPatternMatcher.readSet = function(string) {
    //console.log('readSet', string);
    var set = {
        values: [],
        read: 0,
    };

    while(true) {
        var token = WildcardPatternMatcher.nextToken(string);
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
        else if(token[0] == 'RANGE') {
            token = WildcardPatternMatcher.nextToken(string);
            string = string.substr(token[2]);
            set.read += token[2];
            
            if(token[0] == 'LITERAL') {
                var startCode = set.values[set.values.length - 1].charCodeAt(0) + 1;
                var endCode = token[1].charCodeAt(0);
                
                if(startCode > endCode) {
                    return false;
                    throw new Error('Invalid range.');
                }
                
                for(var i = startCode; i <= endCode; i++) {
                    set.values.push(String.fromCharCode(i));
                }
                //console.log(set);
            }
            else {
                //throw new Error(patternA, patternB);
                return false;
                throw new Error('Invalid token in set: '+token[0]);
            }
        }
        else {
            //throw new Error(patternA, patternB);
            return false;
            throw new Error('Invalid token in set: '+token[0]);
        }
    }
};

WildcardPatternMatcher.readGroup = function(string) {
    var group = {
        options: [],
    };

    var option = '';
    var nestedGroups = 0;
    
    while(true) {
        var token = WildcardPatternMatcher.nextToken(string);
        var character = string.substr(0, token[2]);
        string = string.substr(token[2]);

        if(token[0] == 'END_GROUP') {
            if(nestedGroups == 0) {
                group.options.push(option);
                group.remainder = string;
                return group;
            }
            else {
                nestedGroups--;
            }
        }
        else if(token[0] == 'START_GROUP') {
            nestedGroups++;
        }

        if(token[0] == 'GROUP_DELIMITER') {
            if(nestedGroups == 0) {
                group.options.push(option);
                option = '';
                continue;
            }
        }

        if(token[0] == 'END') {
            return null;
            //throw 'Unexpected end of string while parsing group options.';
        }

        option += character;
    }
};

WildcardPatternMatcher.match = function(patternA, patternB) {
    // Handle exact matches right away for performance
    if(patternA === patternB) {
        return true;
    }
    
    // Replace endings of .* to just * (e.g., make "namespace" match "namespace.*")
    if(patternA.endsWith('.*')) {
        patternA = patternA.replaceLast('.*', '*');
    }
    if(patternB.endsWith('.*')) {
        patternB = patternB.replaceLast('.*', '*');
    }

    // Handle exact matches again for performance
    if(patternA === patternB) {
        return true;
    }

    // If we don't have an exact match, we will start pattern matching
    var wildcardPatternsMatch = function(patternA, patternB) {
        //console.log('wildcardPatternsMatch', patternA, patternB);
        while(true) {
            var tokenA = WildcardPatternMatcher.nextToken(patternA);
            var tokenB = WildcardPatternMatcher.nextToken(patternB);
            //console.log(tokenA, tokenB);
            //console.log(patternA, patternB);

            // Literals
            if(tokenA[0] == 'LITERAL' && tokenB[0] == 'LITERAL') {
                if(tokenA[1] != tokenB[1]) {
                    //console.log('LITERAL', tokenA[1], '!=', tokenB[1]);
                    return false;
                }

                patternA = patternA.substr(1);
                patternB = patternB.substr(1);

                continue;
            }
            
            // Start group on token A
            if(tokenA[0] == 'START_GROUP') {

                patternA = patternA.substr(1);
                var groupA = WildcardPatternMatcher.readGroup(patternA);
                if(!groupA) {
                    return false;
                }
                patternA = groupA.remainder;
                //console.log(groupA);

                for(var i = 0; i < groupA.options.length; i++) {
                    var result = wildcardPatternsMatch(groupA.options[i] + patternA, patternB);
                    if(result) {
                        return true;
                    }
                }

                return false;
            }
            
            // Start group on token B
            if(tokenB[0] == 'START_GROUP') {
                patternB = patternB.substr(1);
                var groupB = WildcardPatternMatcher.readGroup(patternB);
                if(!groupB) {
                    return false;
                }
                patternB = groupB.remainder;

                for(var i = 0; i < groupB.options.length; i++) {
                    var result = wildcardPatternsMatch(patternA, groupB.options[i] + patternB);
                    if(result) {
                        //console.groupEnd();
                        return true;
                    }
                }

                //console.groupEnd();
                return false;
            }

            if(tokenA[0] == 'WILD' || tokenB[0] == 'WILD') {
                if(tokenA[0] == 'WILD') {
                    patternA = patternA.substr(1);

                    var token = WildcardPatternMatcher.nextToken(patternA);
                    if(token[0] == 'END') {
                        return true;
                    }

                    var i = 0;
                    while(i <= patternB.length) {
                        //console.log(patternA, patternB.substr(i));
                        var result = wildcardPatternsMatch(patternA, patternB.substr(i));
                        if(result) {
                            return true;
                        }
                        var token = WildcardPatternMatcher.nextToken(patternB.substr(i));
                        if(token[0] == 'LITERAL' || token[0] == 'WILD' || token[0] == 'ONE_WILD') {
                            i += token[2];
                        }
                        else if(token[0] == 'START_SET') {
                            i++;
                            var set = WildcardPatternMatcher.readSet(patternB.substr(i));
                            i += set.read;
                        }
                        else if(token[0] == 'START_GROUP') {
                            var result = wildcardPatternsMatch('*'+patternA, patternB.substr(i));
                            if(result) {
                                //console.groupEnd();
                                return true;
                            }

                            i++;
                            var group = WildcardPatternMatcher.readGroup(patternB.substr(i));
                            i += group.read;
                        }
                        else {
                            //console.log(patternB, patternA);
                            //console.log("NEED TO SKIP NON-LITERAL (A)" + token[0]);
                            return false;
                        }
                    }
                }

                if(tokenB[0] == 'WILD') {
                    patternB = patternB.substr(1);

                    var token = WildcardPatternMatcher.nextToken(patternB);
                    if(token[0] == 'END') {
                        return true;
                    }

                    var i = 0;
                    while(i <= patternA.length) {
                        var result = wildcardPatternsMatch(patternB, patternA.substr(i));
                        if(result) {
                            return true;
                        }
                        var token = WildcardPatternMatcher.nextToken(patternA.substr(i));
                        if(token[0] == 'LITERAL' || token[0] == 'WILD') {
                            i += token[2];
                        }
                        else if(token[0] == 'START_SET') {
                            i++;
                            var set = WildcardPatternMatcher.readSet(patternA.substr(i));
                            i += set.read;
                        }
                        else if(token[0] == 'START_GROUP') {
                            var result = wildcardPatternsMatch(patternA.substr(i), '*'+patternB);
                            if(result) {
                                //console.groupEnd();
                                return true;
                            }

                            i++;
                            var group = WildcardPatternMatcher.readGroup(patternA.substr(i));
                            i += group.read;
                        }
                        else {
                            //console.log("NEED TO SKIP NON-LITERAL (B) "+token[0]);
                            return false;
                        }
                    }
                }
                
                return false;
            }

            if(tokenA[0] == 'ONE_WILD') {
                if(tokenB[0] == 'LITERAL' || tokenB[0] == 'ONE_WILD') {
                    patternA = patternA.substr(1);
                    patternB = patternB.substr(tokenB[2]);
                    continue;
                }
                else if(tokenB[0] == 'START_SET') {
                    patternA = patternA.substr(1);
                    patternB = patternB.substr(1);
                    var set = WildcardPatternMatcher.readSet(patternB);
                    patternB = set.remainder;
                    continue;
                }
                else if(tokenB[0] == 'WILD') {
                    patternA = patternA.substr(1);
                    //console.log(patternA, patternB);
                    patternB = patternB.substr(1);
                    //console.log(patternA, patternB);
                    var i = 0;
                    while(i <= patternA.length) {
                        var result = wildcardPatternsMatch(patternB, patternA.substr(i));
                        if(result) {
                            return true;
                        }
                        var token = WildcardPatternMatcher.nextToken(patternA.substr(i));
                        if(token[0] == 'LITERAL' || token[0] == 'WILD') {
                            i += token[2];
                        }
                        else if(token[0] == 'START_SET') {
                            i++;
                            var set = WildcardPatternMatcher.readSet(patternA.substr(i));
                            i += set.read;
                        }
                        else {
                            //console.log("NEED TO SKIP NON-LITERAL (B)");
                            return false;
                        }
                    }
                    return false;
                }
                //console.log(patternA, patternB);
                //console.log('ONE_WILD (A) COMPARE TO NON-LITERAL', tokenB[0]);
                return false;
            }

            if(tokenB[0] == 'ONE_WILD') {
                //console.log(patternA, patternB);
                patternB = patternB.substr(1);
                if(tokenA[0] == 'LITERAL' || tokenA[0] == 'ONE_WILD') {
                    patternA = patternA.substr(1);
                    continue;
                }
                //console.log(patternA, patternB);
                //console.log('ONE_WILD (B) COMPARE TO NON-LITERAL', tokenA[0]);
                return false;
            }

            if(tokenA[0] == 'START_SET') {
                patternA = patternA.substr(1);
                var setA = WildcardPatternMatcher.readSet(patternA);
                patternA = setA.remainder;
                if(tokenB[0] == 'LITERAL') {
                    if(setA.values.indexOf(tokenB[1]) != -1) {
                        patternB = patternB.substr(tokenB[2]);
                        continue;
                    }
                    return false;
                }
                if(tokenB[0] == 'START_SET') {
                    patternB = patternB.substr(1);
                    var setB = WildcardPatternMatcher.readSet(patternB);
                    patternB = setA.remainder;
                    //console.log(setA, setB);
                    var found = false;
                    if(setA) {
                        for(var i = 0; i < setA.values.length; i++) {
                            for(var j = 0; j < setB.values.length; j++) {
                                if(setA.values[i] == setB.values[j]) {
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                    if(found) {
                        continue;
                    }
                    return false;
                }
                //console.log(patternA, patternB);
                //console.log("COMPARE SET (A) TO " + tokenB[0]);
                return false;
            }

            if(tokenB[0] == 'START_SET') {
                patternB = patternB.substr(1);
                var setB = WildcardPatternMatcher.readSet(patternB);
                patternB = setB.remainder;

                if(tokenA[0] == 'LITERAL') {
                    if(setB.values.indexOf(tokenA[1]) != -1) {
                        patternA = patternA.substr(1);
                        continue;
                    }
                    return false;
                }
                //console.log("COMPARE SET (B) TO " + tokenA[0]);
                return false;
            }

            if(tokenA[0] == 'END' || tokenB[0] == 'END') {
                return tokenA[0] == 'END' && tokenB[0] == 'END';
            }

            //console.log(patternA, patternB);
            //console.log("Unexpected token: " + tokenA + '-' + tokenB);
            return false;
        }
    }

    return wildcardPatternsMatch(patternA, patternB);
};

// Export
module.exports = WildcardPatternMatcher;