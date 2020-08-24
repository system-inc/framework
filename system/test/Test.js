// Class
class Test {

	async shouldRun() {
		return true;
	}

	async before() {
		//console.log('Before');
	}

	async beforeEach() {
		//console.log('Before each');
	}

	async after() {
		//console.log('After');
	}

	async afterEach() {
		//console.log('After each');
	}
	
}

// Export
export { Test };
