// Class
var ClassTest = Test.extend({

	testIsInstance: function() {
		Assert.false(Class.isInstance(Version), 'not a class definition');
		Assert.false(Class.isInstance({}), '{} is not an instance of a class');
		Assert.false(Class.isInstance([]), '[] is not an instance of a class');
		Assert.false(Class.isInstance(null), 'null is not an instance of a class');
		Assert.true(Class.isInstance(new Version('1.0')), 'is an instance');
		Assert.true(Class.isInstance(new Version('1.0'), Version), 'observes classType parameter');
		Assert.true(Class.isInstance(new Version('1.0'), Class), 'classType parameter may be Class');
		Assert.false(Class.isInstance(new Version('1.0'), Settings), 'observes classType parameter');
	},

	testInheritance: function() {
		var SpecialTestParentClass = Class.extend({

			parentClassConstruct: null,
			parentStringClassVariable: 'string',
			parentNullClassVariable: null,
			parentArrayClassVariable: [],
			parentObjectClassVariable: {},
			parentClassInstanceClassVariable: new Version('1.0'),
			parentTimeClassVariable: new Time(),
			parentContainedReferenceClassVariable: {},

			construct: function() {
				this.parentClassConstruct = 'constructed';
			},

			parentMethodToUse: function() {
				return 'child use me';
			},

			parentMethodToOverride: function() {
				return 'override me';
			},

			parentStaticMethodDefinedInClass: function() {
				return 'static method';
			},

		});

		SpecialTestParentClass.parentStaticMethodDefinedInClass = SpecialTestParentClass.prototype.parentStaticMethodDefinedInClass;
		SpecialTestParentClass.parentStaticMethodDefinedOutOfClass = function() {
			return 'static method defined out of Class.extend';
		}

		var SpecialTestChildClass = SpecialTestParentClass.extend({

			childClassConstruct: null,
			childStringClassVariable: 'string',
			childNullClassVariable: null,
			childArrayClassVariable: [],
			childObjectClassVariable: {},

			construct: function() {
				this.super.apply(this, arguments);
				this.childClassConstruct = 'constructed';
			},

			parentMethodToOverride: function() {
				return 'overridden!';
			},

			childMethodToUse: function() {
				return 'child use me';
			},

			childStaticMethodDefinedInClass: function() {
				return 'static method';
			},

		});

		SpecialTestChildClass.childStaticMethodDefinedInClass = SpecialTestChildClass.prototype.childStaticMethodDefinedInClass;
		SpecialTestChildClass.childStaticMethodDefinedOutOfClass = function() {
			return 'static method defined out of Class.extend';
		}

		// Test the parent
		var specialTestParentClassInstance = new SpecialTestParentClass();
		specialTestParentClassInstance.parentContainedReferenceClassVariable['apple'] = 'macintosh';
		
		Assert.true(Object.hasKey(specialTestParentClassInstance, 'parentClassConstruct'), 'parentClassConstruct key');
		Assert.true(Object.hasKey(specialTestParentClassInstance, 'parentStringClassVariable'), 'parentStringClassVariable key');
		Assert.true(Object.hasKey(specialTestParentClassInstance, 'parentNullClassVariable'), 'parentNullClassVariable key');
		Assert.true(Object.hasKey(specialTestParentClassInstance, 'parentArrayClassVariable'), 'parentArrayClassVariable key');
		Assert.true(Object.hasKey(specialTestParentClassInstance, 'parentObjectClassVariable'), 'parentObjectClassVariable key');
		Assert.true(Object.hasKey(specialTestParentClassInstance, 'parentClassInstanceClassVariable'), 'parentClassInstanceClassVariable key');
		Assert.true(Object.hasKey(specialTestParentClassInstance, 'parentTimeClassVariable'), 'parentTimeClassVariable key');

		Assert.equal(specialTestParentClassInstance.parentClassConstruct, 'constructed', 'parentClassConstruct key set correctly');
		Assert.equal(specialTestParentClassInstance.parentStringClassVariable, 'string', 'parentStringClassVariable key set correctly');
		Assert.equal(specialTestParentClassInstance.parentNullClassVariable, null, 'parentNullClassVariable key set correctly');
		Assert.deepEqual(specialTestParentClassInstance.parentArrayClassVariable, [], 'parentArrayClassVariable key set correctly');
		Assert.deepEqual(specialTestParentClassInstance.parentObjectClassVariable, {}, 'parentObjectClassVariable key set correctly');
		Assert.equal(specialTestParentClassInstance.parentClassInstanceClassVariable, '1.0', 'parentClassInstanceClassVariable key set correctly');

		Assert.equal(specialTestParentClassInstance.parentMethodToOverride(), 'override me', 'class method');
		Assert.equal(specialTestParentClassInstance.parentStaticMethodDefinedInClass(), 'static method', 'class static method called from instance');
		Assert.equal(SpecialTestParentClass.parentStaticMethodDefinedInClass(), 'static method', 'class static method defined in class called from class');
		Assert.equal(SpecialTestParentClass.parentStaticMethodDefinedOutOfClass(), 'static method defined out of Class.extend', 'class static method defined out of Class.extend called from class');
		Assert.strictEqual(specialTestParentClassInstance.parentStaticMethodDefinedOutOfClass, undefined, 'class static method defined out of Class.extend only available by calling from class');

		// Test the child
		var specialTestChildClassInstance = new SpecialTestChildClass();

		Assert.true(Object.hasKey(specialTestChildClassInstance, 'parentClassConstruct'), 'inherited parentClassConstruct key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'parentStringClassVariable'), 'inherited parentStringClassVariable key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'parentNullClassVariable'), 'inherited parentNullClassVariable key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'parentArrayClassVariable'), 'inherited parentArrayClassVariable key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'parentObjectClassVariable'), 'inherited parentObjectClassVariable key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'parentClassInstanceClassVariable'), 'inherited parentClassInstanceClassVariable key');

		Assert.true(Object.hasKey(specialTestChildClassInstance, 'childClassConstruct'), 'childClassConstruct key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'childStringClassVariable'), 'childStringClassVariable key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'childNullClassVariable'), 'childNullClassVariable key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'childArrayClassVariable'), 'childArrayClassVariable key');
		Assert.true(Object.hasKey(specialTestChildClassInstance, 'childObjectClassVariable'), 'childObjectClassVariable key');

		Assert.equal(specialTestChildClassInstance.parentClassConstruct, 'constructed', 'inherited parentClassConstruct key set correctly');
		Assert.equal(specialTestChildClassInstance.parentStringClassVariable, 'string', 'inherited parentStringClassVariable key set correctly');
		Assert.equal(specialTestChildClassInstance.parentNullClassVariable, null, 'inherited parentNullClassVariable key set correctly');
		Assert.deepEqual(specialTestChildClassInstance.parentArrayClassVariable, [], 'inherited parentArrayClassVariable key set correctly');
		Assert.deepEqual(specialTestChildClassInstance.parentObjectClassVariable, {}, 'inherited parentObjectClassVariable key set correctly');

		Assert.equal(specialTestChildClassInstance.childClassConstruct, 'constructed', 'childClassConstruct key set correctly');
		Assert.equal(specialTestChildClassInstance.childStringClassVariable, 'string', 'childStringClassVariable key set correctly');
		Assert.equal(specialTestChildClassInstance.childNullClassVariable, null, 'childNullClassVariable key set correctly');
		Assert.deepEqual(specialTestChildClassInstance.childArrayClassVariable, [], 'childArrayClassVariable key set correctly');
		Assert.deepEqual(specialTestChildClassInstance.childObjectClassVariable, {}, 'childObjectClassVariable key set correctly');

		//Console.log(specialTestParentClassInstance.parentContainedReferenceClassVariable);
		//Console.log(specialTestChildClassInstance.parentContainedReferenceClassVariable);
		Assert.true(specialTestChildClassInstance.parentContainedReferenceClassVariable.isEmpty(), 'child object references are contained to their instantiation and are not tied to parent object references');

		specialTestParentClassInstance.parentClassInstanceClassVariable.major = 2;
		Assert.equal(specialTestChildClassInstance.parentClassInstanceClassVariable, 1, 'inherited class instance variables are localized to their own memory');

		Assert.equal(specialTestChildClassInstance.parentTimeClassVariable.toString(), specialTestChildClassInstance.parentTimeClassVariable.toString(), 'inherited time class instance variables are the same time');
		
		Assert.equal(specialTestChildClassInstance.parentMethodToOverride(), 'overridden!', 'overridden class method');
		Assert.equal(specialTestChildClassInstance.parentMethodToUse(), 'child use me', 'parent class method');
		Assert.equal(specialTestChildClassInstance.childMethodToUse(), 'child use me', 'class method');
		Assert.equal(specialTestChildClassInstance.parentStaticMethodDefinedInClass(), 'static method', 'parent class static method called from instance');
		Assert.strictEqual(specialTestChildClassInstance.parentStaticMethodDefinedOutOfClass, undefined, 'class static method defined out of Class.extend only available by calling from class');
		Assert.equal(SpecialTestChildClass.parentStaticMethodDefinedOutOfClass(), 'static method defined out of Class.extend', 'parent class static method defined out of Class.extend called from class');

		Assert.equal(SpecialTestChildClass.parentStaticMethodDefinedInClass(), 'static method', 'parent class static method defined in class called from class');
		Assert.equal(SpecialTestChildClass.childStaticMethodDefinedInClass(), 'static method', 'class static method defined in class called from class');
		Assert.equal(SpecialTestChildClass.childStaticMethodDefinedOutOfClass(), 'static method defined out of Class.extend', 'class static method defined out of Class.extend called from class');

		// Make sure the child does not mess with the parent
		Assert.false(Object.hasKey(specialTestParentClassInstance, 'childClassConstruct'), 'childClassConstruct key not set on parent');
		Assert.false(Object.hasKey(specialTestParentClassInstance, 'childStringClassVariable'), 'childStringClassVariable key not set on parent');
		Assert.false(Object.hasKey(specialTestParentClassInstance, 'childNullClassVariable'), 'childNullClassVariable key not set on parent');
		Assert.false(Object.hasKey(specialTestParentClassInstance, 'childArrayClassVariable'), 'childArrayClassVariable key not set on parent');
		Assert.false(Object.hasKey(specialTestParentClassInstance, 'childObjectClassVariable'), 'childObjectClassVariable key not set on parent');

		Assert.strictEqual(SpecialTestParentClass.childStaticMethodDefinedInClass, undefined, 'child class static method defined in Class.extend called from class is not available on parent');
		Assert.strictEqual(SpecialTestParentClass.childStaticMethodDefinedOutOfClass, undefined, 'child class static method defined out of Class.extend called from class is not available on parent');
		Assert.strictEqual(specialTestParentClassInstance.childStaticMethodDefinedInClass, undefined, 'child class static method defined in Class.extend called from instance is not available on parent');
		Assert.strictEqual(specialTestParentClassInstance.childStaticMethodDefinedOutOfClass, undefined, 'child class static method defined out of Class.extend called from instance is not available on parent');

		// Test two parents
		var specialTestParentClassInstance1 = new SpecialTestParentClass();
		var specialTestParentClassInstance2 = new SpecialTestParentClass();

		specialTestParentClassInstance2.parentClassInstanceClassVariable.major = 2;
		Assert.equal(specialTestParentClassInstance1.parentClassInstanceClassVariable.toString(), '1.0', 'class instance class variables are in their own memory space');
		Assert.equal(specialTestParentClassInstance2.parentClassInstanceClassVariable.toString(), '2.0', 'class instance class variables are in their own memory space');

		//Console.log(specialTestParentClassInstance1.parentTimeClassVariable);
		//Console.log(specialTestParentClassInstance2.parentTimeClassVariable);
		Assert.equal(specialTestParentClassInstance1.parentTimeClassVariable.toString(), specialTestParentClassInstance2.parentTimeClassVariable.toString(), 'time class instance variables are the same time');
	},

	testGenerators: function*() {
		var SpecialTestClass = Class.extend({

			generator: function*() {
				var result = yield 'hello';

				return result;
			},

		});

		var specialTestClassInstance = new SpecialTestClass();

		var actual = yield specialTestClassInstance.generator();
		var expected = 'hello';
		Assert.equal(actual, expected, 'generator class methods return value when yielded')

		actual = specialTestClassInstance.generator();
		Assert.true(Class.isInstance(actual, Promise), 'generator class methods return promise when not yielded');
	},

});

// Export
module.exports = ClassTest;