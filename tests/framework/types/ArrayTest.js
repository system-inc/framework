ArrayTest = Class.extend({

	testEquality: function() {
		Assert.equal('1', 1, 'The string "1" should be equal to the number 1.');
		Assert.deepEqual('1', 1, 'The string "1" should be deep equal to the number 1.');
		Assert.strictEqual('1', 1, 'The string "1" should not be strict equal to the number 1.');
		Assert.notStrictEqual('1', 1, 'The string "1" should not be strict equal to the number 1.');
	},

});