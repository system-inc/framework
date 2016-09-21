// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Version from './../../../system/version/Version.js';
import Settings from './../../../system/settings/Settings.js';

// Class
class ClassTest extends Test {

	testIsInstance() {
		Assert.false(Class.isInstance(Version), 'not a class definition');
		Assert.false(Class.isInstance({}), '{} is not an instance of a class');
		Assert.false(Class.isInstance([]), '[] is not an instance of a class');
		Assert.false(Class.isInstance(null), 'null is not an instance of a class');

		var versionInstance = new Version('1.0');
		Assert.true(Class.isInstance(versionInstance), 'is an instance');
		Assert.true(Class.isInstance(versionInstance, Version), 'observes classType parameter');
		Assert.false(Class.isInstance(versionInstance, Settings), 'observes classType parameter');
	}

	testInheritance() {
		class SpecialTestParentClass {

			parentClassConstruct = null;
			parentStringClassVariable = 'string';
			parentNullClassVariable = null;
			parentArrayClassVariable = [];
			parentObjectClassVariable = {};
			parentClassInstanceClassVariable = new Version('1.0');
			parentTimeClassVariable = new Time();
			parentContainedReferenceClassVariable = {};

			constructor() {
				this.parentClassConstruct = 'constructed';
			}

			parentMethodToUse() {
				return 'child use me';
			}

			parentMethodToOverride() {
				return 'override me';
			}

			parentStaticMethodDefinedInClass() {
				return 'static method';
			}

			static parentStaticMethodDefinedInClass = SpecialTestParentClass.prototype.parentStaticMethodDefinedInClass;

			static parentStaticMethodDefinedOutOfClass() {
				return 'static method defined out of Class.extend';
			}

		}

		class SpecialTestChildClass extends SpecialTestParentClass {

			childClassConstruct = null;
			childStringClassVariable = 'string';
			childNullClassVariable = null;
			childArrayClassVariable = [];
			childObjectClassVariable = {};

			constructor() {
				super(...arguments);
				this.childClassConstruct = 'constructed';
			}

			parentMethodToOverride() {
				return 'overridden!';
			}

			childMethodToUse() {
				return 'child use me';
			}

			childStaticMethodDefinedInClass() {
				return 'static method';
			}

			static childStaticMethodDefinedInClass = SpecialTestChildClass.prototype.childStaticMethodDefinedInClass;

			static childStaticMethodDefinedOutOfClass() {
				return 'static method defined out of Class.extend';
			}

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

		//app.log(specialTestParentClassInstance.parentContainedReferenceClassVariable);
		//app.log(specialTestChildClassInstance.parentContainedReferenceClassVariable);
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

		//app.log(specialTestParentClassInstance1.parentTimeClassVariable);
		//app.log(specialTestParentClassInstance2.parentTimeClassVariable);
		Assert.equal(specialTestParentClassInstance1.parentTimeClassVariable.toString(), specialTestParentClassInstance2.parentTimeClassVariable.toString(), 'time class instance variables are the same time');
	}

	async testAsync() {
		class SpecialTestClass {

			async asyncFunction() {
				var result = await 'hello';

				return result;
			}

		}

		var specialTestClassInstance = new SpecialTestClass();

		var actual = await specialTestClassInstance.asyncFunction();
		var expected = 'hello';
		Assert.equal(actual, expected, 'async class methods return value when awaited')

		actual = specialTestClassInstance.asyncFunction();
		Assert.true(Class.isInstance(actual, Promise), 'async class methods return promise when not awaited');
	}

	async testImplement() {
		// Class which will implement ClassToImplement
		class MainClass {

			existingProperty = 'MainClass.existingProperty';

			existingMethod() {
				return 'MainClass.existingMethod';
			}

			static existingStaticProperty = 'MainClass.existingStaticProperty';

			static existingStaticMethod() {
				return 'MainClass.existingStaticMethod';
			}

		}

		// The class which will be implemented
		class ClassToImplement {

			existingProperty = 'ClassToImplement.existingProperty';
			implementedProperty = 'ClassToImplement.implementedProperty';

			existingMethod() {
				return 'ClassToImplement.existingMethod';
			}

			implementedMethod() {
				return 'ClassToImplement.implementedMethod';
			}

			async implementedAsyncMethod() {
				return 'ClassToImplement.implementedAsyncMethod';
			}

			static existingStaticProperty = 'ClassToImplement.existingStaticProperty';

			static implementedStaticProperty = 'ClassToImplement.implementedStaticProperty';

			static existingStaticMethod() {
				return 'ClassToImplement.existingStaticMethod';
			}

			static implementedStaticMethod() {
				return 'ClassToImplement.implementedStaticMethod';
			}

		}

		// Make sure MainClass does not implement ClassToImplement yet
		Assert.false(Class.doesImplement(MainClass, ClassToImplement), 'Class.doesImplement() works');

		// MainClass implements ClassToImplement
		Class.implement(MainClass, ClassToImplement);

		//console.log('MainClass static property names', Class.getStaticPropertyNames(MainClass));
		//console.log('ClassToImplement static property names', Class.getStaticPropertyNames(ClassToImplement));
		//console.log('MainClass instance property names', Class.getInstancePropertyNames(MainClass));
		//console.log('ClassToImplement instance property names', Class.getInstancePropertyNames(ClassToImplement));

		// Verify MainClass implements ClassToImplement
		Assert.true(Class.doesImplement(MainClass, ClassToImplement), 'Class.doesImplement() works');

		// Test static properties and methods
		Assert.strictEqual(MainClass.existingStaticProperty, 'MainClass.existingStaticProperty', 'Existing static properties are not overwritten');
		Assert.strictEqual(MainClass.implementedStaticProperty, 'ClassToImplement.implementedStaticProperty', 'Implemented static properties are copied to the implementing class');
		Assert.strictEqual(MainClass.existingStaticMethod(), 'MainClass.existingStaticMethod', 'Existing static methods are not overwritten');
		Assert.strictEqual(MainClass.implementedStaticMethod(), 'ClassToImplement.implementedStaticMethod', 'Implemented static methods are copied to the implementing class');

		// Construct an instance of MainClass
		var mainClass = new MainClass();

		// Test instance properties and methods
		Assert.strictEqual(mainClass.existingProperty, 'MainClass.existingProperty', 'Existing properties are not overwritten');
		app.log('this next test should be uncommented, see Class.js line 141');
		//Assert.strictEqual(mainClass.implementedProperty, 'ClassToImplement.implementedProperty', 'Implemented properties are copied to the implementing class');
		Assert.strictEqual(mainClass.existingMethod(), 'MainClass.existingMethod', 'Existing methods are not overwritten');
		Assert.strictEqual(mainClass.implementedMethod(), 'ClassToImplement.implementedMethod', 'Implemented methods are copied to the implementing class');
		var awaitedImplementedGeneratorMethodValue = await mainClass.implementedAsyncMethod();
		Assert.equal(awaitedImplementedGeneratorMethodValue, 'ClassToImplement.implementedAsyncMethod', 'Implemented generator methods are copied to the implementing class');
	}

}

// Export
export default ClassTest;
