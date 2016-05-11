// Dependencies
var FormControlView = Framework.require('system/web-interface/views/forms/controls/FormControlView.js');

// Class
var TextFormControlView = FormControlView.extend({

    attributes: {
        class: 'control text',
    },

    construct: function() {
        this.super.apply(this, arguments);

        // Keyboard up events trigger form.control.change
        this.on('keyboard.key.*.up', function(event) {
            this.emit('form.control.change', event);
        }.bind(this));
    },

    setValue: function(value) {
        // Make null an empty string
        if(value == null) {
            value = '';
        }

        return this.super(value);
    },

    getValue: function() {
        var value = this.value;

        // Make null an empty string
        if(value == null) {
            value = this.setValue('');
        }

        return value;
    },

    insertText: function(text) {
        this.htmlDocument.insertText(text);

        this.valueChangedOnDom();
    },

	getCursorPosition: function() {
        var position = 0;

        if('selectionStart' in this.domNode) {
            position = this.domNode.selectionStart;
        }
        else if('selection' in document) {
            this.domNode.focus();
            var selectionRange = document.selection.createRange();
            var selectionLength = document.selection.createRange().text.length;
            selectionRange.moveStart('character', -this.domNode.value.length);
            position = selectionRange.text.length - selectionLength;
        }

        return position;
    },

    setCursorPosition: function(index) {
        this.selectRange(index, index);
    },

    selectRange: function(start, end) {
        if(end === undefined) {
            end = start;
        }

        if(start == -1) {
            start = this.domNode.value.length;
        }

        if(end == -1) {
            end = this.domNode.value.length;
        }

        if(this.domNode.setSelectionRange) {
            this.domNode.focus();
            this.domNode.setSelectionRange(start, end);
        }
        else if(this.domNode.createTextRange) {
            var range = this.domNode.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    },

});

// Export
module.exports = TextFormControlView;