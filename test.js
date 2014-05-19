var mygen = function*() {
	yield 'stop 1';
	yield 'stop 2';
	yield 'stop 3';

	return 'pizza';
}

var gen = mygen();