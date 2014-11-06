ObjectTest = Test.extend({

	testIs: function() {
		Assert.true(Object.is({}), 'object literal ({})');
		Assert.false(Object.is([]), 'array literal ([])');
		Assert.false(Object.is(Class), 'Class');
		Assert.true(Object.is(new Class()), 'new Class()')
		Assert.false(Object.is(Version), 'Version');
		Assert.true(Object.is(new Version('1.0')), 'new Version()');
		Assert.false(Object.is(Number), 'Number');
		Assert.false(Object.is(new Date()), 'new Date()');
	},

	testisEmpty: function() {
		var object = {};
		Assert.true(Object.isEmpty(object), 'empty object');

		object = {'a': '1'}
		Assert.false(Object.isEmpty(object), 'object with key');

		var array = [];
		Assert.true(Object.isEmpty(array), 'empty array');

		array = ['a'];
		Assert.false(Object.isEmpty(array), 'array with element');

		var string = '';
		Assert.true(Object.isEmpty(string), 'empty string');

		string = 'string';
		Assert.false(Object.isEmpty(string), 'string with characters');
	},

	testPrototypeIsEmpty: function() {
		var object = {};
		Assert.true(object.isEmpty(), 'empty object');

		object = {'a': '1'}
		Assert.false(object.isEmpty(), 'object with key');

		var array = [];
		Assert.true(array.isEmpty(), 'empty array');

		array = ['a'];
		Assert.false(array.isEmpty(), 'array with element');

		var string = '';
		Assert.true(string.isEmpty(), 'empty string');

		string = 'string';
		Assert.false(string.isEmpty(), 'string with characters');
	},

	testHasKey: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		Assert.true(Object.hasKey(object, 'apple'), 'key exists');
		Assert.false(Object.hasKey(object, 'pineapple'), 'key does not exist');
	},

	testPrototypeHasKey: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		Assert.true(object.hasKey('apple'));
		Assert.false(object.hasKey('pineapple'));
	},

	testGetValueForKey: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		Assert.equal(object.getValueForKey('apple'), 'macintosh', 'key matches');
		Assert.equal(object.getValueForKey('pineapple'), null, 'key does not match');
	},

	testEach: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var string = '';
		object.each(function(key, value) {
			string += key+value;
		});

		Assert.equal(string, 'applemacintoshbananachiquitacherrykirkland', 'key and value are passed in the correct order');
	},

	testEachWithGenerator: function*() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var string = '';
		yield object.each(function*(key, value) {
			string += key+value;
		});

		Assert.equal(string, 'applemacintoshbananachiquitacherrykirkland', 'key and value are passed in the correct order');
	},

	testClone: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var clone = Object.clone(object);

		Assert.deepEqual(object, clone, 'simple object');
		Assert.notStrictEqual(object, clone, 'simple object should not point to same reference');
	},

	testPrototypeClone: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var clone = object.clone();

		Assert.deepEqual(object, clone, 'simple object');
		Assert.notStrictEqual(object, clone, 'simple object should not point to same reference');
	},

	testMerge: function() {
		var a = {
		    'firstLevelA': {
		    	'secondLevel': {
		    		'thirdLevel': [
		    			'a',
		    			'b',
		    		],
		    		'thirdLevelA': 'original',
		    		'thirdLevelB': 'original',
		    	},
		        'secondLevelA': 'original',
		        'secondLevelB': 'original',
		    },
		};

		var b = {
		    'firstLevelA': {
		    	'secondLevel': {
		    		'thirdLevel': [
		    			'a',
		    			'ba',
		    			'c',
		    		],
		    		'thirdLevelB': 'modified',
		    		'thirdLevelC': 'new',
		    	},
		        'secondLevelA': 'modified',
		        'secondLevelC': 'new',
		    },
		};

		var c = a.merge(b);

		var expected = {
		    'firstLevelA': {
		        'secondLevel': {
		            'thirdLevel': [
		                'a',
		                'b',
		                'ba',
		                'c',
		            ],
		            'thirdLevelA': 'original',
		            'thirdLevelB': 'modified',
		            'thirdLevelC': 'new',
		        },
		        'secondLevelA': 'modified',
		        'secondLevelB': 'original',
		        'secondLevelC': 'new',
		    },
		};

		Assert.deepEqual(c, expected, 'Merging should be recursive');
	},

	testSort: function() {
		var object = {
			'cherry': 'kirkland',
			'apple': 'macintosh',
			'banana': 'chiquita',
		};

		var sorted = object.sort();

		Assert.true(Json.encode(sorted).startsWith('{"apple":'), 'keys are sorted alphabetically');
		Assert.true(Json.encode(sorted).endsWith('kirkland"}'), 'keys are sorted alphabetically');
	},

	testToJson: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var actual = object.toJson();
		var expected = '{"apple":"macintosh","banana":"chiquita","cherry":"kirkland"}';
		Assert.equal(actual, expected, 'JSON string matches')
	},

	testToArray: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var actual = Object.toArray(actual);
		Assert.true(Array.is(actual), 'is an array');
		Assert.false(Object.is(actual), 'is not an object');
	},

	testPrototypeToArray: function() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var actual = object.toArray();
		Assert.true(Array.is(actual), 'is an array');
		Assert.false(Object.is(actual), 'is not an object');
	},

});