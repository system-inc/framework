WebComponent.load('Input');

TextInputWebComponent = InputWebComponent.extend({

    listen: function() {
        this.on('change', function() {
            this.valueChangedOnDomElement();
        }.bind(this));

        this.on('keyup', function() {
            this.valueChangedOnDomElement();
        }.bind(this));
    },

    insertText: function(text) {
        document.execCommand('insertText', false, text);

        this.valueChangedOnDomElement();
    },

	getCursorPosition: function() {
        var position = 0;

        if('selectionStart' in this.domElement) {
            position = this.domElement.selectionStart;
        }
        else if('selection' in document) {
            this.domElement.focus();
            var selectionRange = document.selection.createRange();
            var selectionLength = document.selection.createRange().text.length;
            selectionRange.moveStart('character', -this.domElement.value.length);
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
            start = this.domElement.value.length;
        }

        if(end == -1) {
            end = this.domElement.value.length;
        }

        if(this.domElement.setSelectionRange) {
            this.domElement.focus();
            this.domElement.setSelectionRange(start, end);
        }
        else if(this.domElement.createTextRange) {
            var range = this.domElement.createTextRange();
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