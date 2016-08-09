// Dependencies
var FormControlView = Framework.require('system/web-interface/views/forms/controls/FormControlView.js');

// Class
var TextFormControlView = FormControlView.extend({

    attributes: {
        class: 'control text',
    },

    construct: function(settings) {
        this.super.apply(this, arguments);
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

    getCursorData: function() {
        console.log('refactor this and break these variables into their own methods');

        // Selection data
        //var selectionText = this.getSelectionText();
        var selectionText = this.getSelectedText();
        Console.standardLog(selectionText);
        var selectionIsMultiLine = selectionText.contains("\n");

        // Cursor data
        var cursorPosition = this.getCursorPosition();
        var cursorPositionLineStart = allText.lastIndexOf("\n", this.getSelectionStart - 1) + 1;
        var cursorPositionLineEnd;
        // If we are on the last line
        if(allText.substr(this.getSelectionEnd).indexOf("\n") == -1) {
            cursorPositionLineEnd = allText.length;
        }
        // If are are not on the last line
        else {
            cursorPositionLineEnd = cursorPositionLineStart + allText.substr(cursorPositionLineStart).indexOf("\n");
        }

        if(cursorPositionLineEnd == -1) {
            cursorPositionLineEnd = allText.length;
        }
        var cursorPositionLineText = allText.substr(cursorPositionLineStart, cursorPositionLineEnd - cursorPositionLineStart);

        var selectionIsWholeLine = (this.getSelectionStart == cursorPositionLineStart && this.getSelectionEnd == cursorPositionLineEnd);
        var selectionTextLineEnd;
        // If we include the last line
        if(allText.substr(this.getSelectionEnd).indexOf("\n") == -1) {
            selectionTextLineEnd = allText.length;
        }
        // If the last line is not included
        else {
            selectionTextLineEnd = this.getSelectionEnd + allText.substr(this.getSelectionEnd).indexOf("\n");
        }
        
        // Debug
        Console.log('-----');
        Console.log('this.getSelectionStart '+this.getSelectionStart);
        Console.log('this.getSelectionEnd '+this.getSelectionEnd);
        Console.log('selectionTextLineEnd '+selectionTextLineEnd);
        Console.log('selectionText '+selectionText);
        Console.log('selectionIsMultiLine '+selectionIsMultiLine);
        Console.log('selectionIsWholeLine '+selectionIsWholeLine);

        Console.log('cursorPosition '+cursorPosition);
        Console.log('cursorPositionLineStart '+cursorPositionLineStart);
        Console.log('cursorPositionLineEnd '+cursorPositionLineEnd);
        Console.log('cursorPositionLineText '+cursorPositionLineText);
    },

    getSelectionStart: function() {
        return this.domNode.selectionStart;
    },

    getSelectionEnd: function() {
        return this.domNode.selectionEnd;
    },

	getCursorIndex: function() {
        var index = 0;

        if(this.domNode.selectionStart != undefined) {
            index = this.getSelectionStart();
        }
        else {
            this.domNode.focus();
            var selection = this.htmlDocument.getSelection();
            var selectionRange = selection.createRange();
            var selectionLength = selection.createRange().text.length;
            selectionRange.moveStart('character', -this.getValue().length);
            index = selectionRange.text.length - selectionLength;
        }

        return index;
    },

    setCursorIndex: function(index) {
        this.selectRange(index, index);
    },

    selectRange: function(start, end) {
        if(end === undefined) {
            end = start;
        }

        if(start == -1) {
            start = this.getValue().length;
        }

        if(end == -1) {
            end = this.getValue().length;
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