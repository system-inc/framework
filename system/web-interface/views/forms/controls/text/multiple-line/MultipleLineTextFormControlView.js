// Dependencies
var TextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/TextFormControlView.js');

// Class
var MultipleLineTextFormControlView = TextFormControlView.extend({

    tag: 'textarea',

    attributes: {
        class: 'control text multipleLine',
    },

    construct: function(settings) {
        this.super.apply(this, arguments);

        this.settings.setDefaults({
        	wordWrap: false,
        	tabbing: false,
        	selectionTabbing: false,
		});

		// Word wrap
		if(this.settings.get('wordWrap')) {
			Console.log('Enabling word wrap.');
			this.enableWordWrap();
		}

		// Tabbing
		if(this.settings.get('tabbing')) {
			Console.log('Enabling tabbing.');
			this.on('input.key.tab.down', function(event) {
				Console.standardLog('tab!', event);
				event.preventDefault();
				this.getCursorData();
			}.bind(this));
		}

		// Selection tabbing
		if(this.settings.get('selectionTabbing')) {
			Console.log('Enabling selection tabbing.');
		}
    },

    enableWordWrap: function() {
    	this.setAttribute('wrap', 'soft');
    },

    disableWordWrap: function() {
    	this.setAttribute('wrap', 'off');
    },

});

// Export
module.exports = MultipleLineTextFormControlView;