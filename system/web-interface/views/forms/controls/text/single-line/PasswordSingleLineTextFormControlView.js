// Dependencies
var SingleLineTextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/single-line/SingleLineTextFormControlView.js');

// Class
var PasswordSingleLineTextFormControlView = SingleLineTextFormControlView.extend({

    attributes: {
        type: 'password',
        class: 'control text singleLine password',
    },

});

// Export
module.exports = PasswordSingleLineTextFormControlView;