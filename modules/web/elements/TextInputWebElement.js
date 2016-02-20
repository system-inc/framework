WebElement.require('Input');

TextInputWebElement = InputWebElement.extend({

    tag: 'input',

    attributes: {
        type: 'text',
    },

    listen: function() {
        this.on('change', function() {
            this.valueChangedOnDomElement();
        }.bind(this));

        this.on('keyup', function() {
            this.valueChangedOnDomElement();
        }.bind(this));
    },

    clear: function() {
        this.setValue('');
    },

    insertText: function(text) {
        document.execCommand('insertText', false, text);

        this.valueChangedOnDomElement();
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

	getSelectionText: function() {
        var text = '';

        if(window.getSelection) {
            text = window.getSelection().toString();
        }
        else if(document.selection && document.selection.type != 'Control') {
            text = document.selection.createRange().text;
        }

        return text;
    },

});