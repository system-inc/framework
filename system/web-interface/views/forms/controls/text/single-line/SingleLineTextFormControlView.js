// Dependencies
var TextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/TextFormControlView.js');

// Class
var SingleLineTextFormControlView = TextFormControlView.extend({

    tag: 'input',

    attributes: {
        type: 'text',
        class: 'control text singleLine',
    },

});

// Export
module.exports = SingleLineTextFormControlView;