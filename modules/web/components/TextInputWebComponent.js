WebComponent.load('Input');

TextInputWebComponent = InputWebComponent.extend({

	getCursorPosition: function() {
        var position = 0;

        if('selectionStart' in this.element) {
            position = this.element.selectionStart;
        }
        else if('selection' in document) {
            element.focus();
            var selectionRange = document.selection.createRange();
            var selectionLength = document.selection.createRange().text.length;
            selectionRange.moveStart('character', -this.element.value.length);
            position = selectionRange.text.length - selectionLength;
        }

        return position;
    },

    setCursorPosition: function(index) {
        this.selectRange(index, index);
    },

    selectRange: function(start, end) {
        if(typeof end == 'undefined') {
            end = start;
        }

        if(start == -1) {
            start = this.element.value.length;
        }

        if(end == -1) {
            end = this.element.value.length;
        }

        if(this.element.setSelectionRange) {
            this.element.focus();
            this.element.setSelectionRange(start, end);
        }
        else if(this.element.createTextRange) {
            var range = this.element.createTextRange();
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