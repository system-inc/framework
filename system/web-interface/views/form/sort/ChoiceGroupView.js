// Dependencies
var InputView = Framework.require('system/web-interface/views/InputView.js');

// Class
var CheckboxInputView = InputView.extend({

    tag: 'input',

    attributes: {
        type: 'checkbox',
    },

    construct: function() {
        this.super.apply(this, arguments);

        this.on('form.field.change', function() {
            this.valueChangedOnDomElement();
        }.bind(this));
    },

});

// Export
module.exports = CheckboxInputView;