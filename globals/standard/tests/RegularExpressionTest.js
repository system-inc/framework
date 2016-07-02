// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var RegularExpressionTest = Test.extend({

	testIs: function() {
		Assert.true(RegularExpression.is(new RegExp('test')), 'accepts RegExp');
		Assert.true(RegularExpression.is(new RegularExpression('test')), 'accepts RegularExpression');
	},

	testStringMatchesWildcardPattern: function() {
		Assert.true(RegularExpression.stringMatchesWildcardPattern('event1', 'event1.*'), '"event1" matches wildcard pattern, "event1.*"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('event1.secondLevelEvent1', 'event1.*'), '"event1.secondLevelEvent1" matches wildcard pattern, "event1.*"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('event1.secondLevelEvent1.thirdLevelEvent1', 'event1.secondLevelEvent1.*'), '"event1.secondLevelEvent1.thirdLevelEvent1" matches wildcard pattern, "event1.secondLevelEvent1.*"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('event1.secondLevelEvent1.thirdLevelEvent1', 'event1.*'), '"event1.secondLevelEvent1.thirdLevelEvent1" matches wildcard pattern, "event1.*"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('event123', 'event*'), '"event123" matches wildcard pattern, "event*"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('event123event', 'event*event'), '"event123event" matches wildcard pattern, "event*event"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('123event123event123', '*event*event*'), '"123event123event123" matches wildcard pattern, "*event*event*"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('keyboard.key.*.up', 'keyboard.key.*.up.*'), '"keyboard.key.*.up" matches wildcard pattern, "keyboard.key.*.up.*"');
		Assert.false(RegularExpression.stringMatchesWildcardPattern('event', 'event1.*'), '"event" does not match wildcard pattern "event1.*"');
		Assert.false(RegularExpression.stringMatchesWildcardPattern('event', 'event1.*.*'), '"event" does not match wildcard pattern "event1.*.*"');
		Assert.false(RegularExpression.stringMatchesWildcardPattern('123event', 'event'), '"123event" does not match wildcard pattern, "event"');
		Assert.false(RegularExpression.stringMatchesWildcardPattern('123event123', 'event*'), '"123event123" does not match wildcard pattern, "event*"');
		Assert.false(RegularExpression.stringMatchesWildcardPattern('123event123event123', 'event*event*'), '"123event123event123" does not match wildcard pattern, "event*event*"');
		Assert.true(RegularExpression.stringMatchesWildcardPattern('mouse.button.*', 'mouse.*.click.*'), '"mouse.button.*" match wildcard pattern, "mouse.*.click.*"');
	},

});

// Export
module.exports = RegularExpressionTest;