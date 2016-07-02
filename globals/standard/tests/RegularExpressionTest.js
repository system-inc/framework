// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var RegularExpressionTest = Test.extend({

	testIs: function() {
		Assert.true(RegularExpression.is(new RegExp('test')), 'accepts RegExp');
		Assert.true(RegularExpression.is(new RegularExpression('test')), 'accepts RegularExpression');
	},

	testWildcardPatternsMatch: function() {
		Assert.true(RegularExpression.wildcardPatternsMatch('event1', 'event1.*'), '"event1" matches wildcard pattern, "event1.*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('event1.secondLevelEvent1', 'event1.*'), '"event1.secondLevelEvent1" matches wildcard pattern, "event1.*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('event1.secondLevelEvent1.thirdLevelEvent1', 'event1.secondLevelEvent1.*'), '"event1.secondLevelEvent1.thirdLevelEvent1" matches wildcard pattern, "event1.secondLevelEvent1.*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('event1.secondLevelEvent1.thirdLevelEvent1', 'event1.*'), '"event1.secondLevelEvent1.thirdLevelEvent1" matches wildcard pattern, "event1.*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('event123', 'event*'), '"event123" matches wildcard pattern, "event*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('event123event', 'event*event'), '"event123event" matches wildcard pattern, "event*event"');
		Assert.true(RegularExpression.wildcardPatternsMatch('123event123event123', '*event*event*'), '"123event123event123" matches wildcard pattern, "*event*event*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('keyboard.key.*.up', 'keyboard.key.*.up.*'), '"keyboard.key.*.up" matches wildcard pattern, "keyboard.key.*.up.*"');
		Assert.false(RegularExpression.wildcardPatternsMatch('event', 'event1.*'), '"event" does not match wildcard pattern "event1.*"');
		Assert.false(RegularExpression.wildcardPatternsMatch('event', 'event1.*.*'), '"event" does not match wildcard pattern "event1.*.*"');
		Assert.false(RegularExpression.wildcardPatternsMatch('123event', 'event'), '"123event" does not match wildcard pattern, "event"');
		Assert.false(RegularExpression.wildcardPatternsMatch('123event123', 'event*'), '"123event123" does not match wildcard pattern, "event*"');
		Assert.false(RegularExpression.wildcardPatternsMatch('123event123event123', 'event*event*'), '"123event123event123" does not match wildcard pattern, "event*event*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('mouse.button.*', 'mouse.*.click.*'), '"mouse.button.*" match wildcard pattern, "mouse.*.click.*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('one.two.*', 'one.*.three.*'), '"one.two.*" match wildcard pattern, "one.*.three.*"');
	},

});

// Export
module.exports = RegularExpressionTest;