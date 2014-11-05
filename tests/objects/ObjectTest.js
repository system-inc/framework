ObjectTest = Test.extend({

	testMerge: function() {
		var a = {
		    'firstLevelA': {
		    	'secondLevel': {
		    		'thirdLevel': [
		    			'a',
		    			'b',
		    		],
		    		'thirdLevelA': 'original',
		    		'thirdLevelB': 'original',
		    	},
		        'secondLevelA': 'original',
		        'secondLevelB': 'original',
		    },
		};

		var b = {
		    'firstLevelA': {
		    	'secondLevel': {
		    		'thirdLevel': [
		    			'a',
		    			'ba',
		    			'c',
		    		],
		    		'thirdLevelB': 'modified',
		    		'thirdLevelC': 'new',
		    	},
		        'secondLevelA': 'modified',
		        'secondLevelC': 'new',
		    },
		};

		var c = a.merge(b);

		var expected = {
		    'firstLevelA': {
		        'secondLevel': {
		            'thirdLevel': [
		                'a',
		                'b',
		                'ba',
		                'c',
		            ],
		            'thirdLevelA': 'original',
		            'thirdLevelB': 'modified',
		            'thirdLevelC': 'new',
		        },
		        'secondLevelA': 'modified',
		        'secondLevelB': 'original',
		        'secondLevelC': 'new',
		    },
		};

		Assert.deepEqual(c, expected, 'Merging should be recursive');
	},

});