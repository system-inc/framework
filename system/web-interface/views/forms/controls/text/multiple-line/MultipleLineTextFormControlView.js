// Dependencies
var TextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/TextFormControlView.js');

// Class
var MultipleLineTextFormControlView = TextFormControlView.extend({

    tag: 'textarea',

    attributes: {
        class: 'control text multipleLine',
    },

});

// Export
module.exports = MultipleLineTextFormControlView;