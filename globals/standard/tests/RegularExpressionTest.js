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
		// Standard comparison
		Assert.true(RegularExpression.wildcardPatternsMatch('abc', 'abc'));
		Assert.true(RegularExpression.wildcardPatternsMatch('hello.world', 'hello.world'));
		Assert.true(RegularExpression.wildcardPatternsMatch('', ''));
		Assert.true(RegularExpression.wildcardPatternsMatch('***', '***'));
		Assert.true(RegularExpression.wildcardPatternsMatch('???', '???'));
		Assert.false(RegularExpression.wildcardPatternsMatch('hello.world', 'hello.universe'));
		Assert.false(RegularExpression.wildcardPatternsMatch('abc', 'abd'));

		// "?" matches a single character
		Assert.true(RegularExpression.wildcardPatternsMatch('?', 'a'));
		Assert.true(RegularExpression.wildcardPatternsMatch('a?d', 'acd'));
		Assert.false(RegularExpression.wildcardPatternsMatch('?', ''));

		// "*" matches zero or more characters
		Assert.true(RegularExpression.wildcardPatternsMatch('*', 'abc'));
		Assert.true(RegularExpression.wildcardPatternsMatch('*', '*'));
		Assert.true(RegularExpression.wildcardPatternsMatch('*', '**'));
		Assert.true(RegularExpression.wildcardPatternsMatch('*', ''));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc', 'a*c'));
		Assert.true(RegularExpression.wildcardPatternsMatch('a*c', 'a*c'));
		Assert.true(RegularExpression.wildcardPatternsMatch('hello.*.earth', 'hello.middle.earth'));
		Assert.true(RegularExpression.wildcardPatternsMatch('prefix*', 'prefix:extended*'));
		Assert.true(RegularExpression.wildcardPatternsMatch('*suffix', '*:extended:suffix'));
		Assert.true(RegularExpression.wildcardPatternsMatch('left*right', 'left*middle*right'));
		Assert.true(RegularExpression.wildcardPatternsMatch('hello*', '*ok'));
		Assert.true(RegularExpression.wildcardPatternsMatch('a*b*c', 'a*b*d*b*c'));
		Assert.false(RegularExpression.wildcardPatternsMatch('prefix*', 'wrong:prefix:*'));
		Assert.false(RegularExpression.wildcardPatternsMatch('*suffix', '*suffix:wrong'));
		Assert.false(RegularExpression.wildcardPatternsMatch('left*right', 'right*middle*left'));
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
		Assert.false(RegularExpression.wildcardPatternsMatch('keyboard.key.*.up', 'keyboard.key.*.down'), 'From HtmlEventProxy');
		Assert.true(RegularExpression.wildcardPatternsMatch('html*.mountedToDom', 'htmlDocument.scroll.*'), 'From HtmlEventProxy');

		// "[abc]" indicates a set of any single character, in this case it will match either "a", "b", or "c"
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc]', 'a'));
		Assert.false(RegularExpression.wildcardPatternsMatch('[abc]', 'd'));
		Assert.true(RegularExpression.wildcardPatternsMatch('a[bc]d', 'acd'));
		Assert.true(RegularExpression.wildcardPatternsMatch('a[bc]d', 'a[ce]d'));
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc][cde][efg]', '[abc][cde][efg]'));
		Assert.false(RegularExpression.wildcardPatternsMatch('mouse.button.2.click', 'mouse.button.[1345].click'), 'From HtmlEventProxy');

		// Various mix of patterns
		Assert.true(RegularExpression.wildcardPatternsMatch('a[bc]d*wyz', 'abd*w[xy]z'));
		Assert.true(RegularExpression.wildcardPatternsMatch('[abcd]d', '*d'));
		Assert.false(RegularExpression.wildcardPatternsMatch('pre[ab]fix* ', 'pre[xy]fix*'));
		Assert.false(RegularExpression.wildcardPatternsMatch('a*?de', 'ace'));
		Assert.false(RegularExpression.wildcardPatternsMatch('?*b*?', 'bcb'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc?efg?ijk?n?p', 'abcdefg[hijk]ijk*mnop'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]efg[hij]ijk[lmn]mno[pqr]q', 'abcdefg[hij]ijk*lmno?q'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc*fgh*ijklmn*pqr*tu', 'abcdefgh[ijk]jklmn?qr*u'));
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc]*[def]*[abc]', 'cda'));
		Assert.true(RegularExpression.wildcardPatternsMatch('ab*?*de', 'abcde'));
		Assert.true(RegularExpression.wildcardPatternsMatch('[abc]*[cde]*[efg]', 'abcde'));
		Assert.true(RegularExpression.wildcardPatternsMatch('ab*?*de', 'abcde'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc*def*hij', 'abc*def*hij'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]hij', 'a*j'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc*hij*lmno', 'abcde*hi*no'));
		Assert.true(RegularExpression.wildcardPatternsMatch('pre[ab]fix*', 'pre[bc]fix*'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]?fghi?*nop*[tuv]uv[wxy]?yz', 'abcdefghijklmnopqrstuvwxyz'));
		Assert.true(RegularExpression.wildcardPatternsMatch('abc[def]?fghi?*nop*[tuv]uv[wxy]?yz', 'a?[cde]defg*?ilmn[opq]*tu*[xyz]*'));
		Assert.true(RegularExpression.wildcardPatternsMatch('a?[cde]defg*?ilmn[opq]*tu*[xyz]*', 'abc[def]?fghi?*nop*[tuv]uv[wxy]?yz'));
		
		// TODO: Fix this
		//Assert.true(RegularExpression.wildcardPatternsMatch('abcd[efg\\]hi]\\tjklm\\\\no?pq[rs?]tu', 'abcd]\tjklm\\\\no\\tpq\\?tu'));

		// (|) sets of groups of characters
		Assert.true(RegularExpression.wildcardPatternsMatch('start.(one|two).end', 'start.one.end'));
		Assert.true(RegularExpression.wildcardPatternsMatch('start.([abc]|[cde]).end', 'start.a.end'));
		
		// TODO: Fix these
		//Assert.true(RegularExpression.wildcardPatternsMatch('mouse.button.two.click', 'mouse.button.(one|two).click'), 'Alternatives in a capture groups');
		//Assert.true(RegularExpression.wildcardPatternsMatch('mouse.button.2.click', 'mouse.button.(1|2).click'), 'Alternative numbers in a capture groups');

		// Ranges
		// TODO: Fix these
		//Assert.true(RegularExpression.wildcardPatternsMatch('start.[a-z].end', 'start.b.end'));
		//Assert.true(RegularExpression.wildcardPatternsMatch('start.[A-Z].end', 'start.B.end'));
		//Assert.true(RegularExpression.wildcardPatternsMatch('start.[a-Z].end', 'start.A.end'));
		//Assert.true(RegularExpression.wildcardPatternsMatch('start.[0-9].end', 'start.5.end'));
	},

});

// Export
module.exports = RegularExpressionTest;