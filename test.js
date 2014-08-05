	Promise = require('./framework/libraries/bluebird/bluebird.js');

	function test() {
		var promise1 = new Promise(function(resolve1) {
			var promise2 = new Promise(function(resolve2) {
				throw new Error('Error in promise2!');
			});

			promise2.catch(function(error2) {
				console.log('Caught at error2', error2);
				throw error2;
			});
		});

		promise1.catch(function(error1) {
			console.log('Caught at error1', error1);
		});

		Promise.onPossiblyUnhandledRejection(function(error, promise) {
			console.log('caught');
		});
	}

	test();

//function promise() {
//	var promise = new Promise(function(resolve, reject) {
//		throw('Oh no!');
//	});

//	function thrower(exception) {
//		throw (exception);
//	}

//	promise.catch(function(exception) {
//		thrower(exception);
//	});

//	return promise;
//}

//try {	
//	promise();
//}
//catch(exception) {
//	console.log('Caught!', exception);
//}


// Create a promise in the generator and see if its throw can come back


// THIS WORKS
//function* generator() {
//	yield 'start';

//	//var test = (function() {
//	//	return new Error();
//	//})();

//	var test = yield new Promise(function(resolve) {
//		throw new Error();
//	});
//	console.log('test', test);

//	//if(test instanceof Error) {
//	//	throw test;
//	//}	
	
//	yield 'end';
//}

//var invokedGenerator = generator();
//try {
//	console.log(invokedGenerator.next());
//	console.log(invokedGenerator.next());
//	console.log(invokedGenerator.next());
//	console.log(invokedGenerator.next());
//}
//catch(exception) {
//	console.log('Caught where I want!', exception);
//}

//var Person = function() {
//	this.name = 'Chuck';
//}

//Person.prototype.speak = function() {
//	throw new Error('muted!');
//	console.log('My name is', this.name);
//}

//var person = new Person();

//try {
//	person.speak();	
//}
//catch(error) {
//	console.log(error.stack);
//	Error.stackTraceLimit = 100;
//	Error.prepareStackTrace = function(error, stack) {
//		return stack;
//	}
//	Error.captureStackTrace(error);
//	error.stack.forEach(function(callSite) {
//		console.log(callSite.getFileName(), callSite.getFunctionName(), callSite.getThis().name);
//	});
//	//console.log(error.message);
//	//console.log(error.stack);
//	//console.log(error.context, 'could not speak.');
//}

////person.speak();