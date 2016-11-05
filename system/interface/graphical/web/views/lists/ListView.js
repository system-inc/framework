// Dependencies
var View = Framework.require('system/web-interface/views/View.js');
var ListItemView = Framework.require('system/web-interface/views/lists/ListItemView.js');

// Class
var ListView = View.extend({

	tag: 'ul',

	attributes: {
		class: 'list',
	},

	addItem: function(listItemViewSettings) {
		var listItemView = new ListItemView(listItemViewSettings);
		this.append(listItemView);

		return listItemView;
	},

	setDirection: function(direction) {
		if(direction == 'horizontal') {
			this.addClass('horizontal');
		}
		else {
			this.removeClass('horizontal');
		}
	},

});

// Export
module.exports = ListView;