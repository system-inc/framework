Promise = require('./framework/libraries/bluebird.js');

function promise() {
	var promise = new Promise(function(resolve, reject) {
		throw('Oh no!');
	});

	promise.catch(function(exception) {
		throw(exception);
	});

	return promise;
}

try {	
	promise();
}
catch(exception) {
	console.log('Caught!', exception);
}




// THIS WORKS
//function* generator() {
//	yield 'start';
//	throw 'error';	
//	yield 'end';
//}

//var invokedGenerator = generator();
//try {
//	console.log(invokedGenerator.next());
//	console.log(invokedGenerator.next());
//	console.log(invokedGenerator.next());
//}
//catch(exception) {
//	console.log(exception);
//}