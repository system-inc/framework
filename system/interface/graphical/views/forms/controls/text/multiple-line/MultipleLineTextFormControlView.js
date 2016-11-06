// Dependencies
var TextFormControlView = Framework.require('system/interface/graphical/views/forms/controls/text/TextFormControlView.js');

// Class
var MultipleLineTextFormControlView = TextFormControlView.extend({

    tag: 'textarea',

    attributes: {
        class: 'control text multipleLine',
    },

    construct: function(settings) {
        super(settings);

        this.settings.setDefaults({
        	wordWrap: false,
		});

		// Word wrap
		if(this.settings.get('wordWrap')) {
			//app.log('Enabling word wrap.');
			this.enableWordWrap();
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