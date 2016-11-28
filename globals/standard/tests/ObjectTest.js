// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import Version from 'framework/system/version/Version.js';

// Class
class ObjectTest extends Test {

	testIs() {
		Assert.true(Object.is({}), 'object literal ({})');
		Assert.false(Object.is([]), 'array literal ([])');
		Assert.false(Object.is(Class), 'Class');
		Assert.true(Object.is(new Class()), 'new Class()')
		Assert.false(Object.is(Version), 'Version');
		Assert.true(Object.is(new Version('1.0')), 'new Version()');
		Assert.false(Object.is(Number), 'Number');
		Assert.false(Object.is(new Date()), 'new Date()');
	}

	testisEmpty() {
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
	}

	testPrototypeIsEmpty() {
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
	}

	testHasKey() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		Assert.true(Object.hasKey(object, 'apple'), 'key exists');
		Assert.false(Object.hasKey(object, 'pineapple'), 'key does not exist');
	}

	testPrototypeHasKey() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		Assert.true(object.hasKey('apple'));
		Assert.false(object.hasKey('pineapple'));
	}

	testGetValueForKey() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		Assert.equal(object.getValueForKey('apple'), 'macintosh', 'key matches');
		Assert.equal(object.getValueForKey('pineapple'), null, 'key does not match');
	}

	testEach() {
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
	}

	async testEachWithAsync() {
		// No await in generator
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};
		var string = '';
		await object.each(async function(key, value) {
			string += key+value;
		});
		Assert.equal(string, 'applemacintoshbananachiquitacherrykirkland', 'no await, key and value are passed in the correct order');

		// await in generator
		object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};
		string = '';
		await object.each(async function(key, value) {
			await Function.delay(25);
			string += await key+value;
		});
		Assert.equal(string, 'applemacintoshbananachiquitacherrykirkland', 'await, key and value are passed in the correct order');

		// with .bind(this)
		object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};
		string = '';
		await object.each(async function(key, value) {
			await Function.delay(25);
			string += await key+value;
		}.bind(this));
		Assert.equal(string, 'applemacintoshbananachiquitacherrykirkland', '.bind(this) with await, key and value are passed in the correct order');
	}

	testClone() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var clone = Object.clone(object);

		Assert.deepEqual(object, clone, 'simple object');
		Assert.notStrictEqual(object, clone, 'simple object should not point to same reference');

		// Test cloning class instances
		var version = new Version('1.0');
		var versionClone = Object.clone(version);

		// Change a property on the source
		version.major = 2;

		Assert.notStrictEqual(version, versionClone, 'instance clones are not in the same memory');
		Assert.notEqual(version.major, versionClone.major, 'properties of instance clones are not in the same memory');
		Assert.true(Class.isInstance(versionClone), 'instance clones pass Class.isInstance');
		Assert.true(versionClone instanceof Version, 'instance clones are instanceof their subclass');
		Assert.true(Class.isInstance(versionClone, Version), 'instance clones are instanceof their subclass');
		Assert.equal(version.toString(), '2.0', 'instance clones receive prototypes correctly');
		Assert.equal(versionClone.toString(), '1.0', 'instance clones receive prototypes correctly');
	}

	testPrototypeClone() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var clone = object.clone();

		Assert.deepEqual(object, clone, 'simple object');
		Assert.notStrictEqual(object, clone, 'simple object should not point to same reference');
	}

	testMerge() {
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
	}

	testSort() {
		var object = {
			'cherry': 'kirkland',
			'apple': 'macintosh',
			'banana': 'chiquita',
		};

		var sorted = object.sort();

		Assert.true(Json.encode(sorted).startsWith('{"apple":'), 'keys are sorted alphabetically');
		Assert.true(Json.encode(sorted).endsWith('kirkland"}'), 'keys are sorted alphabetically');
	}

	testToJson() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var actual = object.toJson();
		var expected = '{"apple":"macintosh","banana":"chiquita","cherry":"kirkland"}';
		Assert.equal(actual, expected, 'JSON string matches')
	}

	testToArray() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var actual = Object.toArray(actual);
		Assert.true(Array.is(actual), 'is an array');
		Assert.false(Object.is(actual), 'is not an object');
	}

	testPrototypeToArray() {
		var object = {
			'apple': 'macintosh',
			'banana': 'chiquita',
			'cherry': 'kirkland',
		};

		var actual = object.toArray();
		Assert.true(Array.is(actual), 'is an array');
		Assert.false(Object.is(actual), 'is not an object');
	}

}

// Export
export default ObjectTest;
