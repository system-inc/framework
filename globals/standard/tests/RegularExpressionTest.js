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
		Assert.true(RegularExpression.wildcardPatternsMatch('mouse.button.*', 'mouse.*.click.*'), '"mouse.button.*" match wildcard pattern, "mouse.*.click.*"');
		Assert.true(RegularExpression.wildcardPatternsMatch('one.two.*', 'one.*.three.*'), '"one.two.*" match wildcard pattern, "one.*.three.*"');

		Assert.true(RegularExpression.wildcardPatternsMatch('[abcd]d', '*d'), 'Recursive Backtracking');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc', 'abc'), 'literal');
		Assert.true(RegularExpression.wildcardPatternsMatch('*', 'abc'), 'base *');
		Assert.true(RegularExpression.wildcardPatternsMatch('?', 'a'), 'base ?');
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc]', 'a'), 'base set');
		Assert.true(RegularExpression.wildcardPatternsMatch('prefix*', 'prefix:extended*'), 'from question');
		Assert.true(RegularExpression.wildcardPatternsMatch('*suffix', '*:extended:suffix'), 'from question');
		Assert.true(RegularExpression.wildcardPatternsMatch('left*right', 'left*middle*right'), 'from question');
		Assert.true(RegularExpression.wildcardPatternsMatch('a*b*c', 'a*b*d*b*c'), 'from question');
		Assert.true(RegularExpression.wildcardPatternsMatch('hello*', '*ok'), 'from question');
		Assert.true(RegularExpression.wildcardPatternsMatch('pre[ab]fix*', 'pre[bc]fix*'), 'from question');
		Assert.true(RegularExpression.wildcardPatternsMatch('***', '***'), 'mirror *');
		Assert.true(RegularExpression.wildcardPatternsMatch('???', '???'), 'mirror ?');

		Assert.true(RegularExpression.wildcardPatternsMatch('abc?efg?ijk?n?p', 'abcdefg[hijk]ijk*mnop'), '? vs all');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]efg[hij]ijk[lmn]mno[pqr]q', 'abcdefg[hij]ijk*lmno?q'), 'set vs all');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc*fgh*ijklmn*pqr*tu', 'abcdefgh[ijk]jklmn?qr*u'), 'any vs all');
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc][cde][efg]', '[abc][cde][efg]'), 'mirror set');
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc]*[def]*[abc]', 'cda'), 'zero length *');
		Assert.true(RegularExpression.wildcardPatternsMatch('ab*?*de', 'abcde'), 'zero length *');
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc]*[cde]*[efg]', 'abcde'), '1 length *');
		Assert.true(RegularExpression.wildcardPatternsMatch('ab*?*de', 'abcde'), '1 length *');

		Assert.true(RegularExpression.wildcardPatternsMatch('abc*def*hij', 'abc*def*hij'), 'recursive *');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]hij', 'a*j'), 'set in any');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc*hij*lmno', 'abcde*hi*no'), '* at different points in string');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]?fghi?*nop*[tuv]uv[wxy]?yz', 'abcdefghijklmnopqrstuvwxyz'), 'Mixed positions all types');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]?fghi?*nop*[tuv]uv[wxy]?yz', 'a?[cde]defg*?ilmn[opq]*tu*[xyz]*'), 'The monster');
		Assert.true(RegularExpression.wildcardPatternsMatch('a?[cde]defg*?ilmn[opq]*tu*[xyz]*', 'abc[def]?fghi?*nop*[tuv]uv[wxy]?yz'), 'The monster');
		Assert.true(RegularExpression.wildcardPatternsMatch('abcd[efg\\]hi]\\tjklm\\\\no?pq[rs?]tu', 'abcd]\tjklm\\\\no\\tpq\\?tu'), 'escaping');
		Assert.true(RegularExpression.wildcardPatternsMatch('*', '*'), 'm.buettner');

		Assert.true(RegularExpression.wildcardPatternsMatch('*', '**'), 'm.buettner');
		Assert.true(RegularExpression.wildcardPatternsMatch('*', ''), 'm.buettner');
		Assert.true(RegularExpression.wildcardPatternsMatch('', ''), 'm.buettner');
		Assert.true(RegularExpression.wildcardPatternsMatch('abc', 'a*c'), 'm.buettner');
		Assert.true(RegularExpression.wildcardPatternsMatch('a*c', 'a*c'), 'm.buettner');

		Assert.true(RegularExpression.wildcardPatternsMatch('a[bc]d', 'acd'), 'm.buettner');
		Assert.true(RegularExpression.wildcardPatternsMatch('a[bc]d', 'a[ce]d'), 'm.buettner');
		Assert.true(RegularExpression.wildcardPatternsMatch('a?d', 'acd'), 'm.buettner');
		Assert.true(RegularExpression.wildcardPatternsMatch('a[bc]d*wyz', 'abd*w[xy]z'), 'm.buettner');

		Assert.false(RegularExpression.wildcardPatternsMatch('event', 'event1.*'), '"event" does not match wildcard pattern "event1.*"');
		Assert.false(RegularExpression.wildcardPatternsMatch('event', 'event1.*.*'), '"event" does not match wildcard pattern "event1.*.*"');
		Assert.false(RegularExpression.wildcardPatternsMatch('123event', 'event'), '"123event" does not match wildcard pattern, "event"');
		Assert.false(RegularExpression.wildcardPatternsMatch('123event123', 'event*'), '"123event123" does not match wildcard pattern, "event*"');
		Assert.false(RegularExpression.wildcardPatternsMatch('123event123event123', 'event*event*'), '"123event123event123" does not match wildcard pattern, "event*event*"');

		Assert.false(RegularExpression.wildcardPatternsMatch('prefix*', 'wrong:prefix:*'), 'from question');
		Assert.false(RegularExpression.wildcardPatternsMatch('*suffix', '*suffix:wrong'), 'from question');
		Assert.false(RegularExpression.wildcardPatternsMatch('left*right', 'right*middle*left'), 'from question');
		Assert.false(RegularExpression.wildcardPatternsMatch('pre[ab]fix* ', 'pre[xy]fix*'), 'from question');
		Assert.false(RegularExpression.wildcardPatternsMatch('abc', 'abd'), 'unmatched literal');
		Assert.false(RegularExpression.wildcardPatternsMatch('[abc]', 'd'), 'unmatched set');
		Assert.false(RegularExpression.wildcardPatternsMatch('?', ''), 'unmatched ?');
		Assert.false(RegularExpression.wildcardPatternsMatch('a*?de', 'ace'), '* terminated by "?" => "c".');
		Assert.false(RegularExpression.wildcardPatternsMatch('?*b*?', 'bcb'), 'Last ? missed');
	},

});

// Export
module.exports = RegularExpressionTest;