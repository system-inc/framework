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
	// http://stackoverflow.com/questions/18695727/algorithm-to-find-out-whether-the-matches-for-two-glob-patterns-or-regular-expr/18816736#18816736

	// Class WildcardPatternToken
	function WildcardPatternToken(value, type, previousWildcardPatternToken) {
	    this.value = value;
	    this.type = type;
	    this.index = -1;
	    // Shared end points
	    this.endPoints = {
	    	head: this,
	    	tail: this,
    	};
	    this.next = null;
	    this.previous = null;

	    if(previousWildcardPatternToken) {
	        if(previousWildcardPatternToken.next) {
	        	throw ('Previous WildcardPatternToken already connected.');
	        }
	        previousWildcardPatternToken.next = this;
	        this.previous = previousWildcardPatternToken;
	        this.index = previousWildcardPatternToken.index + 1;
	        this.endPoints = previousWildcardPatternToken.endPoints;
	        this.endPoints.tail = this;
	    }
	};
	WildcardPatternToken.prototype.removePrevious = function () {
	    this.previous = null;
	    this.endPoints.head = this;

	    return this;
	};
	WildcardPatternToken.prototype.removeNext = function () {
	    this.next = null;
	    this.endPoints.tail = this;

	    return this;
	};
	WildcardPatternToken.prototype.toString = function () {
	    var string = this.index + '. ';
	    switch(this.type) {
	        case WildcardPatternTokenTypes.single: string += '?'; break;
	        case WildcardPatternTokenTypes.set: string += '[' + this.value.replace(']', '\\]') + ']'; break;
	        case WildcardPatternTokenTypes.character: string += '\'' + this.value.replace('\'', '\\\'') + '\''; break;
	        case WildcardPatternTokenTypes.anyString: string += '*'; break;
	    }

	    return string;
	};

	// Class WildcardPatternComparison
	function WildcardPatternComparison(wildcardPatternANext, wildcardPatternBNext, wildcardPatternsMatch) {
	    this.wildcardPatternANext = wildcardPatternANext;
	    this.wildcardPatternBNext = wildcardPatternBNext;
	    this.wildcardPatternsMatch = (wildcardPatternsMatch === false) ? false : true;
	}
	// Swaps wildcardPatternA and wildcardPatternB and returns this
	WildcardPatternComparison.prototype.swapWildcardPatternTokens = function () {
	    var temp = this.wildcardPatternANext;
	    this.wildcardPatternANext = this.wildcardPatternBNext;
	    this.wildcardPatternBNext = temp;
	    return this;
	};
	// Static properties
	WildcardPatternComparison.falseComparison = new WildcardPatternComparison(null, null, false);

	// Class WildcardPatternTokenTypes
	var WildcardPatternTokenTypes = {
	    character: 'C',
	    single: '?',
	    set: 'S',
	    anyString: '*',
	    unknown: '!',
	};

	function getWildcardPatternComparison(wildcardPatternA, wildcardPatternB) {
	    var leftToken = null;
	    var rightToken = null;
	    var result = new WildcardPatternComparison(null, null, true);

	    leftToken = (!wildcardPatternA || wildcardPatternA instanceof WildcardPatternToken) ? wildcardPatternA : tokenize(wildcardPatternA);
	    rightToken = (!wildcardPatternB || wildcardPatternB instanceof WildcardPatternToken) ? wildcardPatternB : tokenize(wildcardPatternB);

	    var log = [];

	    while((leftToken || rightToken) && result.wildcardPatternsMatch) {
	        log.push({
	            leftToken: (leftToken) ? leftToken.toString() : null,
	            rightToken: (rightToken) ? rightToken.toString() : null,
	            result: null,
	            wildcardPatternANext: null,
	            wildcardPatternBNext: null
	        });

	        result = compareTokens(leftToken, rightToken);

	        if(result.log) log = log.concat(result.log);

	        log[log.length - 1].result = result.wildcardPatternsMatch;
	        if(result.wildcardPatternANext) log[log.length - 1].wildcardPatternANext = result.wildcardPatternANext.toString();
	        if(result.wildcardPatternBNext) log[log.length - 1].wildcardPatternBNext = result.wildcardPatternBNext.toString();

	        leftToken = result.wildcardPatternANext;
	        rightToken = result.wildcardPatternBNext;
	    }

	    if(leftToken || rightToken) log.push({
	        leftToken: (leftToken) ? leftToken.toString() : null,
	        rightToken: (rightToken) ? rightToken.toString() : null,
	        result: false,
	        wildcardPatternANext: null,
	        wildcardPatternBNext: null
	    });
	    
	    // Want to return distinct result to add log too (bad result was sharing)
	    result = new WildcardPatternComparison(result.wildcardPatternANext, result.wildcardPatternBNext, result.wildcardPatternsMatch);
	    result.log = log;

	    return result;
	}

	function compareTokens(leftToken, rightToken) {
	    if(!leftToken && rightToken) return compareTokens(rightToken, leftToken).swapWildcardPatternTokens();
	    
	    switch(leftToken.type) {
	        case WildcardPatternTokenTypes.character: return characterCompare(leftToken, rightToken);
	        case WildcardPatternTokenTypes.single: return singleCompare(leftToken, rightToken);
	        case WildcardPatternTokenTypes.set: return setCompare(leftToken, rightToken);
	        case WildcardPatternTokenTypes.anyString: return anyCompare(leftToken, rightToken);
	    }
	}

	function anyCompare(tAny, tOther) {
	    if(!tOther) return new WildcardPatternComparison(tAny.next, null);

	    var result = WildcardPatternComparison.falseComparison;

	    while(tOther && !result.wildcardPatternsMatch) {
	        while(tOther && !result.wildcardPatternsMatch) {
	            switch(tOther.type) {
	                case WildcardPatternTokenTypes.character: result = characterCompare(tOther, tAny.next).swapWildcardPatternTokens(); break;
	                case WildcardPatternTokenTypes.single: result = singleCompare(tOther, tAny.next).swapWildcardPatternTokens(); break;
	                case WildcardPatternTokenTypes.set: result = setCompare(tOther, tAny.next).swapWildcardPatternTokens(); break;
	                case WildcardPatternTokenTypes.anyString:
	                    // the anyCompare from the getWildcardPatternComparison will take over the processing.
	                    result = getWildcardPatternComparison(tAny, tOther.next);
	                    if(result.wildcardPatternsMatch) return result;
	                    result = getWildcardPatternComparison(tOther, tAny.next).swapWildcardPatternTokens();
	                    if(result.wildcardPatternsMatch) return result;
	                    return WildcardPatternComparison.falseComparison;
	            }
	                  
	            if(!result.wildcardPatternsMatch) tOther = tOther.next;
	        }

	        if(result.wildcardPatternsMatch) {
	            // we've found a starting point, but now we want to make sure this will always work.
	            result = getWildcardPatternComparison(result.wildcardPatternANext, result.wildcardPatternBNext);
	            if(!result.wildcardPatternsMatch) tOther = tOther.next;
	        }
	    }

	    // If we never got a good result that means we've eaten everything.
	    if(!result.wildcardPatternsMatch) result = new WildcardPatternComparison(tAny.next, null, true);
	    
	    return result;
	}

	function characterCompare(tChar, tOther) {
	    if(!tOther) return WildcardPatternComparison.falseComparison;

	    switch(tOther.type) {
	        case WildcardPatternTokenTypes.character: return characterCharacterCompare(tChar, tOther); 
	        case WildcardPatternTokenTypes.single: return new WildcardPatternComparison(tChar.next, tOther.next);
	        case WildcardPatternTokenTypes.set: return setCharCompare(tOther, tChar).swapWildcardPatternTokens(); 
	        case WildcardPatternTokenTypes.anyString: return anyCompare(tOther, tChar).swapWildcardPatternTokens();
	    }
	}

	function singleCompare(tSingle, tOther) {
	    if(!tOther) return WildcardPatternComparison.falseComparison;

	    switch(tOther.type) {
	        case WildcardPatternTokenTypes.character: return new WildcardPatternComparison(tSingle.next, tOther.next);
	        case WildcardPatternTokenTypes.single: return new WildcardPatternComparison(tSingle.next, tOther.next);
	        case WildcardPatternTokenTypes.set: return new WildcardPatternComparison(tSingle.next, tOther.next);
	        case WildcardPatternTokenTypes.anyString: return anyCompare(tOther, tSingle).swapWildcardPatternTokens();
	    }
	}
	function setCompare(tSet, tOther) {
	    if(!tOther) return WildcardPatternComparison.falseComparison;

	    switch(tOther.type) {
	        case WildcardPatternTokenTypes.character: return setCharCompare(tSet, tOther);
	        case WildcardPatternTokenTypes.single: return new WildcardPatternComparison(tSet.next, tOther.next);
	        case WildcardPatternTokenTypes.set: return setSetCompare(tSet, tOther);
	        case WildcardPatternTokenTypes.anyString: return anyCompare(tOther, tSet).swapWildcardPatternTokens();
	    }
	}

	function anySingleCompare(tAny, tSingle) {
	    var nextResult = (tAny.next) ? singleCompare(tSingle, tAny.next).swapWildcardPatternTokens() :
	        new WildcardPatternComparison(tAny, tSingle.next);
	    return (nextResult.wildcardPatternsMatch) ? nextResult: new WildcardPatternComparison(tAny, tSingle.next);
	}

	function anyCharCompare(tAny, tChar) {
	    var nextResult = (tAny.next) ? characterCompare(tChar, tAny.next).swapWildcardPatternTokens() :
	        new WildcardPatternComparison(tAny, tChar.next);

	    return (nextResult.wildcardPatternsMatch) ? nextResult : new WildcardPatternComparison(tAny, tChar.next);
	}

	function characterCharacterCompare(litA, litB) {
	    return (litA.value === litB.value) ?
	        new WildcardPatternComparison(litA.next, litB.next) : WildcardPatternComparison.falseComparison;
	}

	function setCharCompare(tSet, tChar) {
	    return (tSet.value.indexOf(tChar.value) > -1) ?
	        new WildcardPatternComparison(tSet.next, tChar.next) : WildcardPatternComparison.falseComparison;
	}

	function setSetCompare(tSetA, tSetB) {
	    var setA = tSetA.value,
	        setB = tSetB.value;

	    for (var i = 0, il = setA.length; i < il; i++) {
	        if(setB.indexOf(setA.charAt(i)) > -1) return new WildcardPatternComparison(tSetA.next, tSetB.next);
	    }

	    return WildcardPatternComparison.falseComparison;
	}

	// Returns starting token
	function tokenize(pattern) {
	    var tokenizer = /(\\.)|([^*?[\\])|(\*)|(\?)|(\[(?:\\\]|[^\]])*\])/gi;
	    var match;
	    var currentWildcardPatternToken = new WildcardPatternToken('', WildcardPatternTokenTypes.unknown, null);
	    var value;

	    while((match = tokenizer.exec(pattern))) {
	        for (var i = 1, il = match.length; i < il; i++) {
	            if(match[i]) {
	                value = match[0];
	  
	                switch(i) {
	                    case 1:
	                        value = value.charAt(1);
	                        switch(value) {
	                            case 't': value = '\t'; break;
	                            case 'r': value = '\r'; break;
	                            case 'n': value = '\n'; break;
	                            case 'b': value = '\b'; break;
	                            case 'f': value = '\f'; break;
	                            case 'v': value = '\v'; break;
	                        }
	                        currentWildcardPatternToken = new WildcardPatternToken(value, WildcardPatternTokenTypes.character, currentWildcardPatternToken);
	                        break;
	                    case 2:
	                        currentWildcardPatternToken = new WildcardPatternToken(value, WildcardPatternTokenTypes.character, currentWildcardPatternToken);
	                        break;
	                    case 3:
	                        if(currentWildcardPatternToken.type !== WildcardPatternTokenTypes.anyString) {
	                            currentWildcardPatternToken = new WildcardPatternToken(value, WildcardPatternTokenTypes.anyString, currentWildcardPatternToken);
	                        } 
	                        break;
	                    case 4: currentWildcardPatternToken = new WildcardPatternToken(value, WildcardPatternTokenTypes.single, currentWildcardPatternToken); break;
	                    case 5:
	                        currentWildcardPatternToken = new WildcardPatternToken(value.substring(1, value.length - 1).replace('\\]', ']'), WildcardPatternTokenTypes.set, currentWildcardPatternToken);
	                        break;
	                }
	                break;
	            }
	        }
	    }

	    // Advance endpoints to true start
	    if((currentWildcardPatternToken = currentWildcardPatternToken.endPoints.head.next)) {
	        return currentWildcardPatternToken.removePrevious();
	    }

	    // Empty pattern
	    return null;
	}

	var wildcardPatternsMatch = false;

	// Make "event1" match "event1.*"
	if(wildcardPatternA.endsWith('.*')) {
		wildcardPatternA = wildcardPatternA.replaceLast('.*', '*');
	}
	if(wildcardPatternB.endsWith('.*')) {
		wildcardPatternB = wildcardPatternB.replaceLast('.*', '*');
	}

	var wildcardPatternComparison = getWildcardPatternComparison(wildcardPatternA, wildcardPatternB);
	//Console.log('wildcardPatternComparison', wildcardPatternComparison);

	wildcardPatternsMatch = wildcardPatternComparison.wildcardPatternsMatch;

	return wildcardPatternsMatch;
};

/*
// This is an alternate algorithm for doing wildcard matching
RegularExpression.wildcardPatternsMatch = function(wildcardPatternA, wildcardPatternB) {
	// http://stackoverflow.com/questions/18695727/algorithm-to-find-out-whether-the-matches-for-two-glob-patterns-or-regular-expr/18813883#18813883

	// Enumeration for specifying the type of pattern
	var PatternTypes = {
	    prefix: 0,
	    suffix: 1,
	    all: 2
	};

	// Find out whether the supplied suffixes or prefixes intersect
	function tokensIntersect(tokenA, tokenB, patternType) {
	    var regularExpressionString = '';
	    var characterInCharacterClass = false;
	    var characterClass = '';
	    
	    // Build up a regular expression for tokenA
	    for(var characterPosition = 0; characterPosition < tokenA.length; characterPosition++) {
	        var character = tokenA.charAt(characterPosition);
	        
	        // Build expression differently depending on whether the current character is within a character class
	        if(characterInCharacterClass) {
	            if(character == ']') {
	                characterClass = RegularExpression.escape(characterClass);
	                regularExpressionString += "([" + characterClass + "?]|\\[[^\\]]*[" + characterClass + "].*?\\])";
	                characterClass = '';
	                characterInCharacterClass = false;
	            }
	            else {
	                characterClass += character;
	            }
	        }
	        else {
	            if(character == '[') {
	                characterInCharacterClass = true;
	            }
	            else if(character == '?') {
	                regularExpressionString += "(\\[.*?\\]|[^\\]])";
	            }
	            else if(character == '*') {
	                regularExpressionString += "(\\[.*?\\]|[^\\]])*";
	            }
	            else {
	                regularExpressionString += "([" + RegularExpression.escape(character) + "?]|\\[[^\\]]*[" + RegularExpression.escape(character) + "].*?\\])";
	            }
	        }
	    }
	    
	    if(characterInCharacterClass) {
	    	throw new Error('Unterminated character class in pattern: '+tokenA);
	    }
	    
	    switch(patternType) {
	        case PatternTypes.prefix:
	            // Prefix must be at the start - the ^ regularExpression character denotes this
	            regularExpressionString = "^"+regularExpressionString;
	            break;
	        case PatternTypes.suffix:
	            // Suffix must be at the end - the $ regularExpression character denotes this
	            regularExpressionString += "$";
	            break;
	        default:
	            // Otherwise assume it is the whole string - use both regularExpression characters
	            regularExpressionString = "^"+regularExpressionString + "$";
	    }
	    
	    // Test tokenB against the regular expression created for tokenA
	    var regularExpression = new RegExp(regularExpressionString, "i");
	    var intersect = regularExpression.test(tokenB);

	    return intersect;
	}

	// Find out whether the supplied patterns intersect
	function wildcardPatternsIntersect(wildcardPatternA, wildcardPatternB) {
	    var intersect = null;
	    
	    // If either pattern is null, use empty string instead
	    wildcardPatternA = wildcardPatternA || '';
	    wildcardPatternB = wildcardPatternB || '';
	    
	    // Get prefixes and suffixes for both patterns
	    var wildcardPatternAFirstStarPosition = wildcardPatternA.indexOf('*');
	    var wildcardPatternAPrefix = wildcardPatternAFirstStarPosition < 0 ? wildcardPatternA : wildcardPatternA.substr(0, wildcardPatternA.indexOf('*'));
	    var wildcardPatternASuffix = wildcardPatternA.substr(wildcardPatternA.lastIndexOf('*') + 1);
	    var wildcardPatternBFirstStarPosition = wildcardPatternB.indexOf('*');
	    if((wildcardPatternAFirstStarPosition >= 0) && (wildcardPatternBFirstStarPosition >= 0)) {
	        var wildcardPatternBPrefix = wildcardPatternBFirstStarPosition < 0 ? wildcardPatternB : wildcardPatternB.substr(0, wildcardPatternB.indexOf('*'));
	        var wildcardPatternBSuffix = wildcardPatternB.substr(wildcardPatternB.lastIndexOf('*') + 1);
	        var prefixesIntersect = tokensIntersect(wildcardPatternAPrefix, wildcardPatternBPrefix, PatternTypes.prefix) || tokensIntersect(wildcardPatternBPrefix, wildcardPatternAPrefix, PatternTypes.prefix);
	        var suffixesIntersect = tokensIntersect(wildcardPatternASuffix, wildcardPatternBSuffix, PatternTypes.suffix) || tokensIntersect(wildcardPatternBSuffix, wildcardPatternASuffix, PatternTypes.suffix);
	        intersect = prefixesIntersect && suffixesIntersect;
	    }
	    else if(wildcardPatternAFirstStarPosition >= 0) {
	        intersect = tokensIntersect(wildcardPatternA, wildcardPatternB, PatternTypes.all);
	    }
	    else {
	        intersect = tokensIntersect(wildcardPatternB, wildcardPatternA, PatternTypes.all);
	    }

	    return intersect;
	}

	var wildcardPatternsMatch = false;

	// Make "event1" match "event1.*"
	if(wildcardPatternA.endsWith('.*')) {
		wildcardPatternA = wildcardPatternA.replaceLast('.*', '*');
	}
	if(wildcardPatternB.endsWith('.*')) {
		wildcardPatternB = wildcardPatternB.replaceLast('.*', '*');
	}

	wildcardPatternsMatch = wildcardPatternsIntersect(wildcardPatternA, wildcardPatternB);

	return wildcardPatternsMatch;
};
*/

// Export
module.exports = RegularExpression;