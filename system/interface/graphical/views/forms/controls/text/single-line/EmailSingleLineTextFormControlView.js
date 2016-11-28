// Dependencies
var SingleLineTextFormControlView = Framework.require('framework/system/interface/graphical/views/forms/controls/text/single-line/SingleLineTextFormControlView.js');

// Class
var EmailSingleLineTextFormControlView = SingleLineTextFormControlView.extend({

    attributes: {
        type: 'email',
        class: 'control text singleLine email',
    },

});

// Export
module.exports = EmailSingleLineTextFormControlView;