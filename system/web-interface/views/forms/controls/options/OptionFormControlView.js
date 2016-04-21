// Dependencies
var FormControlView = Framework.require('system/web-interface/views/form/controls/FormControlView.js');

// Class
var OptionFormControlView = FormControlView.extend({

    tag: 'input',

    attributes: {
        type: 'checkbox',
        class: 'control option',
    },

});

// Export
module.exports = OptionFormControlView;