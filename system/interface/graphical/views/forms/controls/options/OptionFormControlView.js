// Dependencies
var FormControlView = Framework.require('framework/system/interface/graphical/views/forms/controls/FormControlView.js');

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