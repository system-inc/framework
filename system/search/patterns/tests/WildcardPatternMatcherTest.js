// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var WildcardPatternMatcher = Framework.require('system/search/patterns/WildcardPatternMatcher.js');

// Class
var WildcardPatternMatcherTest = Test.extend({

	testWildcardPatternsMatch: function() {
		// Standard comparison
	    Assert.true(WildcardPatternMatcher.match('abc', 'abc'));
	    Assert.true(WildcardPatternMatcher.match('hello.world', 'hello.world'));
	    Assert.true(WildcardPatternMatcher.match('', ''));
	    Assert.false(WildcardPatternMatcher.match('hello.world', 'hello.universe'));
	    Assert.false(WildcardPatternMatcher.match('abc', 'abd'));

	    // "?" matches a single character
	    Assert.true(WildcardPatternMatcher.match('?', 'a'));
	    Assert.true(WildcardPatternMatcher.match('a?d', 'acd'));
	    Assert.false(WildcardPatternMatcher.match('?', ''));
	    Assert.true(WildcardPatternMatcher.match('???', '???'));

	    // "*" matches zero or more characters
	    Assert.true(WildcardPatternMatcher.match('*', 'abc'));
	    Assert.true(WildcardPatternMatcher.match('abc', 'a*c'));
	    Assert.true(WildcardPatternMatcher.match('a*c', 'a*c'));
	    Assert.true(WildcardPatternMatcher.match('*', ''));
	    Assert.true(WildcardPatternMatcher.match('hello.*.earth', 'hello.middle.earth'));
	    Assert.true(WildcardPatternMatcher.match('left*right', 'left*middle*right'));
	    
	    // "[abc]" indicates a set of any single character, in this case it will match either "a", "b", or "c"
	    Assert.true(WildcardPatternMatcher.match('[abc]', 'a'));
	    Assert.false(WildcardPatternMatcher.match('[abc]', 'd'));
	    Assert.true(WildcardPatternMatcher.match('a[bc]d', 'acd'));
	    Assert.true(WildcardPatternMatcher.match('a[bc]d', 'a[ce]d'));
	    Assert.true(WildcardPatternMatcher.match('[abc][cde][efg]', '[abc][cde][efg]'));
	    Assert.false(WildcardPatternMatcher.match('input.press.2.press', 'input.press.[1345].press'));
	    
	    // More difficult patterns
	    Assert.true(WildcardPatternMatcher.match('hello*', '*ok'));
	    Assert.true(WildcardPatternMatcher.match('a*b*c', 'a*b*d*b*c'));
	    Assert.false(WildcardPatternMatcher.match('prefix*', 'wrong:prefix:*'));
	    Assert.false(WildcardPatternMatcher.match('*suffix', '*suffix:wrong'));
	    Assert.true(WildcardPatternMatcher.match('prefix*', 'prefix:extended*'));
	    Assert.true(WildcardPatternMatcher.match('*suffix', '*:extended:suffix'));
	    Assert.false(WildcardPatternMatcher.match('left*right', 'right*middle*left'));
	    Assert.false(WildcardPatternMatcher.match('right*middle*left', 'left*right'));
	    Assert.true(WildcardPatternMatcher.match('event1', 'event1.*'));
	    Assert.true(WildcardPatternMatcher.match('event1.secondLevelEvent1', 'event1.*'));
	    Assert.true(WildcardPatternMatcher.match('event1.secondLevelEvent1.thirdLevelEvent1', 'event1.secondLevelEvent1.*'));
	    Assert.true(WildcardPatternMatcher.match('event1.secondLevelEvent1.thirdLevelEvent1', 'event1.*'));
	    Assert.true(WildcardPatternMatcher.match('event123', 'event*'));
	    Assert.true(WildcardPatternMatcher.match('event123event', 'event*event'));
	    Assert.true(WildcardPatternMatcher.match('123event123event123', '*event*event*'));
	    Assert.true(WildcardPatternMatcher.match('input.key.*.up', 'input.key.*.up.*'));
	    Assert.true(WildcardPatternMatcher.match('input.press.*', 'input.*.press.*'));
	    Assert.true(WildcardPatternMatcher.match('one.two.*', 'one.*.three.*'));
	    Assert.false(WildcardPatternMatcher.match('input.key.*.up', 'input.key.*.down'));
	    Assert.true(WildcardPatternMatcher.match('html*.mountedToDom', 'htmlDocument.scroll.*'));
	    Assert.true(WildcardPatternMatcher.match('*', '*'));
	    Assert.true(WildcardPatternMatcher.match('*', '**'));
	    Assert.true(WildcardPatternMatcher.match('***', '***'));
	    
	    // Various mix of patterns
	    Assert.true(WildcardPatternMatcher.match('a[bc]d*wyz', 'abd*w[xy]z'));
	    Assert.true(WildcardPatternMatcher.match('[abcd]d', '*d'));
	    Assert.false(WildcardPatternMatcher.match('pre[ab]fix* ', 'pre[xy]fix*'));
	    Assert.false(WildcardPatternMatcher.match('a*?de', 'ace'));
	    Assert.false(WildcardPatternMatcher.match('?*b*?', 'bcb'));
	    Assert.true(WildcardPatternMatcher.match('abc?efg?ijk?n?p', 'abcdefg[hijk]ijk*mnop'));
	    Assert.true(WildcardPatternMatcher.match('abc[def]efg[hij]ijk[lmn]mno[pqr]q', 'abcdefg[hij]ijk*lmno?q'));
	    Assert.true(WildcardPatternMatcher.match('abc*fgh*ijklmn*pqr*tu', 'abcdefgh[ijk]jklmn?qr*u'));
	    Assert.true(WildcardPatternMatcher.match('[abc]*[def]*[abc]', 'cda'));
	    Assert.true(WildcardPatternMatcher.match('ab*?*de', 'abcde'));
	    Assert.true(WildcardPatternMatcher.match('[abc]*[cde]*[efg]', 'abcde'));
	    Assert.true(WildcardPatternMatcher.match('ab*?*de', 'abcde'));
	    Assert.true(WildcardPatternMatcher.match('abc*def*hij', 'abc*def*hij'));
	    Assert.true(WildcardPatternMatcher.match('abc[def]hij', 'a*j'));
	    Assert.true(WildcardPatternMatcher.match('abc*hij*lmno', 'abcde*hi*no'));
	    Assert.true(WildcardPatternMatcher.match('pre[ab]fix*', 'pre[bc]fix*'));
	    Assert.true(WildcardPatternMatcher.match('abc[def]?fghi?*nop*[tuv]uv[wxy]?yz', 'abcdefghijklmnopqrstuvwxyz'));
	    Assert.true(WildcardPatternMatcher.match('abc[def]?fghi?*nop*[tuv]uv[wxy]?yz', 'a?[cde]defg*?ilmn[opq]*tu*[xyz]*'));
	    Assert.true(WildcardPatternMatcher.match('a?[cde]defg*?ilmn[opq]*tu*[xyz]*', 'abc[def]?fghi?*nop*[tuv]uv[wxy]?yz'));

	    // (|) sets of groups of characters
	    Assert.true(WildcardPatternMatcher.match('start.(one|two).end', 'start.one.end'));
	    Assert.true(WildcardPatternMatcher.match('start.(one|two).end', 'start.two.end'));
	    Assert.false(WildcardPatternMatcher.match('start.(one|two).end', 'start.three.end'));
	    Assert.false(WildcardPatternMatcher.match('start.(one|two).end', 'start..end'));
	    Assert.false(WildcardPatternMatcher.match('start.(one|two).end', 'start.().end'));
	    Assert.true(WildcardPatternMatcher.match('start.([abc]|[cde]).end', 'start.a.end'));
	    Assert.false(WildcardPatternMatcher.match('start.([abc]|[cde]).end', 'start.f.end'));
	    Assert.false(WildcardPatternMatcher.match('start.([abc]|[cde]).end', 'start..end'));

	    Assert.true(WildcardPatternMatcher.match('input.key.(f11|f.(control|command))', 'input.key.*'));
	    Assert.true(WildcardPatternMatcher.match('input.key.*', 'input.key.(f11|f.(control|command))'));

	    Assert.true(WildcardPatternMatcher.match('input.key.*', 'input.key.i.alt.(control|command)'));
	    Assert.true(WildcardPatternMatcher.match('input.key.i.alt.(control|command)', 'input.key.*'));

	    Assert.true(WildcardPatternMatcher.match('input.key.*', 'input.key.w.(alt|control).(control|command)'));
	    Assert.true(WildcardPatternMatcher.match('input.key.w.(alt|control).(control|command)', 'input.key.*'));

	    Assert.true(WildcardPatternMatcher.match('input.key.*', 'input.key.(alt|control|meta|shift)'));
	    Assert.true(WildcardPatternMatcher.match('input.key.(alt|control|meta|shift)', 'input.key.*'));

	    Assert.true(WildcardPatternMatcher.match('input.press.(one|two).down', 'input.press.two.down'));
	    Assert.true(WildcardPatternMatcher.match('input.press.two.down', 'input.press.(one|two).down'));
	    Assert.true(WildcardPatternMatcher.match('input.press.(1|2).down', 'input.press.2.down'));
	    Assert.true(WildcardPatternMatcher.match('input.press.2.down', 'input.press.(1|2).down'));
	    Assert.true(WildcardPatternMatcher.match('input.press.2.down', 'input.press.(2|1).down'));

	    // Ranges
	    Assert.true(WildcardPatternMatcher.match('start.[a-z].end', 'start.b.end'));
	    Assert.true(WildcardPatternMatcher.match('start.[A-Z].end', 'start.B.end'));
	    Assert.true(WildcardPatternMatcher.match('start.[a-z].end', 'start.z.end'));
	    Assert.true(WildcardPatternMatcher.match('start.[0-9].end', 'start.5.end'));
	    Assert.true(WildcardPatternMatcher.match('start.[0-9a-z].end', 'start.5.end'));
	    Assert.true(WildcardPatternMatcher.match('start.[0-9a-z].end', 'start.x.end'));
	    Assert.true(WildcardPatternMatcher.match('start.[0-9a-z].end', 'start.c.end'));
	    Assert.true(WildcardPatternMatcher.match('start.([0-9a-z]|middle).end', 'start.middle.end'));
	    Assert.true(WildcardPatternMatcher.match('start.([0-9a-z]|middle).end', 'start.b.end'));
	    Assert.false(WildcardPatternMatcher.match('start.([0-9a-z]|middle).end', 'start.center.end'));
	    
	    Assert.true(WildcardPatternMatcher.match('start.(one|two|three).end', 'start.three.end'));
	    Assert.true(WildcardPatternMatcher.match('start.(one|two).end', 'start.*.end'));
	    Assert.true(WildcardPatternMatcher.match('start.(one|two).end', 'start.(two|one).end'));
	    Assert.true(WildcardPatternMatcher.match('start.(one|t[wo0]o).end', 'start.(t0o|three).end'));
	    Assert.true(WildcardPatternMatcher.match('start.((one|two)|(three|four)).end', 'start.(two|four).end'));
	    Assert.true(WildcardPatternMatcher.match('(start*|*end)', 'start.xyz'));
	    Assert.true(WildcardPatternMatcher.match('(start*|*end)', 'xyz.end'));
	    Assert.true(WildcardPatternMatcher.match('start.xyz', '(start*|*end)'));
	    Assert.true(WildcardPatternMatcher.match('(start*|*end)', 'xyz.end'));

	    // Commas
	    Assert.true(WildcardPatternMatcher.match('test.(.|,)', 'test.?'));
	    Assert.true(WildcardPatternMatcher.match('test.,.hello', 'test.?.hello'));
	    Assert.true(WildcardPatternMatcher.match('test*', 'test,'));

	    // Invalid set
	    Assert.false(WildcardPatternMatcher.match('test.hello[', 'test.hello'));
	    Assert.false(WildcardPatternMatcher.match('test.hello.[', 'test.hello.]'));
		Assert.true(WildcardPatternMatcher.match('test.hello.]', 'test.hello.]')); // valid because exact match
		Assert.false(WildcardPatternMatcher.match('test.hello.[*', 'test.hello.['));
		Assert.false(WildcardPatternMatcher.match('test.hello.]*', 'test.hello.]'));

	    // Invalid group
		Assert.false(WildcardPatternMatcher.match('test.hello.(', 'test.hello.)'));
		Assert.false(WildcardPatternMatcher.match('test.hello.(*', 'test.hello.('));
		Assert.false(WildcardPatternMatcher.match('test.hello.)*', 'test.hello.)'));

		// Invalid range
		Assert.false(WildcardPatternMatcher.match('test.hello.[a-$]', 'test.hello.*)'));	
	},

});

// Export
module.exports = WildcardPatternMatcherTest;