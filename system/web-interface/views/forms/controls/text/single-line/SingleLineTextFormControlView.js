// Dependencies
var TextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/TextFormControlView.js');

// Class
var SingleLineTextFormControlView = TextFormControlView.extend({

    tag: 'input',

    attributes: {
        type: 'text',
        class: 'control text singleLine',
    },

    construct: function(settings) {
        this.super.apply(this, arguments);
    },

});

// Export
module.exports = SingleLineTextFormControlView;