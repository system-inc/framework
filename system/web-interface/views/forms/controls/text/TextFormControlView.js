// Dependencies
import FormControlView from './../../../../../../system/web-interface/views/forms/controls/FormControlView.js';

// Class
class TextFormControlView extends FormControlView {

    attributes = {
        class: 'control text',
    }

    constructor(settings) {
        super(settings);

        this.settings.setDefaults({
            indentationSymbol: '    ', // four spaces
            tabKeyInsertsIndentationSymbol: false,
            indentationManagement: false,
        });

        // Set the indentation symbol from the settings
        this.indentationSymbol = this.settings.get('indentationSymbol');

        // Listen for tab key down if tabbing or selection tabbing are enabled
        if(this.settings.get('tabKeyInsertsIndentationSymbol') || this.settings.get('indentationManagement')) {
            this.on('input.key.tab.down', function(event) {
                this.handleInputKeyTabDown(event);
            }.bind(this));
        }
    }

    setValue(value) {
        // TODO: If we are programmitically changing the value of the control (as below with indentation management), we should make sure that undo still works perfectly

        // Make null an empty string
        if(value == null) {
            value = '';
        }

        return super.setValue(value);
    }

    getValue() {
        var value = this.value;

        // Make null an empty string
        if(value == null) {
            value = this.setValue('');
        }

        return value;
    }

    insertText(text) {
        this.viewContainer.insertText(text);

        this.valueChangedOnDom();
    }

    handleInputKeyTabDown(event) {
        //Console.standardLog('handleInputKeyTabDown', event);

        var eventReturnValue = true;

        // Prevent the default behavior from happening (changing focus to the next element)
        event.preventDefault();

        // If tabKeyInsertsIndentationSymbol is enabled and indentationManagement is not enabled
        if(this.settings.get('tabKeyInsertsIndentationSymbol') && !this.settings.get('indentationManagement')) {
            // When the user presses tab, insert an indentation symbol regardless of selection or if the shift key is pressed
            //app.log('Inserting tab character');
            this.insertIndentationSymbol();
        }
        // If indentation management is enabled
        else if(this.settings.get('indentationManagement')) {
            eventReturnValue = false;

            // Get the selection text
            var selectedText = this.getSelectedText();

            // If nothing is selected
            if(selectedText === null) {
                // Shift+tab with nothing selected, outdent the current line
                if(event.modifierKeysDown.shift) {
                    this.outdentCurrentLine();
                }
                // Tab with nothing selected, insert an indentation symbol
                else {
                    //app.log('Tab with nothing selected, insert an indentation symbol');
                    this.insertIndentationSymbol();
                }
            }
            // If something is selected
            else {
                var multipleLinesSelected = (selectedText.getLineCount() > 1);

                // If the shift key is down
                if(event.modifierKeysDown.shift) {
                    // Shift+tab with a multiple-line selection, outdent the selected lines
                    if(multipleLinesSelected) {
                        this.outdentSelectedLines();
                    }
                    // Shift+tab with a single-line selection, outdent the selected line
                    else {
                        this.outdentCurrentLine();
                    }
                }
                else {
                    // Tab with a multiple-line selection, indent the selected lines
                    if(multipleLinesSelected) {
                        this.indentSelectedLines();
                    }
                    // Tab with a single-line selection, indent the selected line
                    else {
                        this.indentCurrentLine();
                    }
                }
            }
        }

        return eventReturnValue;
    }

    insertIndentationSymbol() {
        this.viewContainer.insertText(this.settings.get('indentationSymbol'));
    }

    indentCurrentLine() {
        //app.log('indentCurrentLine');

        // Insert an indentation symbol at the start of the current line
        var updatedValue = this.getValue().insert(this.getCurrentLineStartIndex(), this.settings.get('indentationSymbol'));

        // Capture these variables before updating the value on the text form control
        var selectionStartIndex = this.getSelectionStartIndex();
        var selectionEndIndex = this.getSelectionEndIndex();
        var indentationSymbolLength = this.settings.get('indentationSymbol').length;

        // Update the text form control value
        this.setValue(updatedValue);

        // Update the selection and cursor position
        this.selectRange((selectionStartIndex + indentationSymbolLength), (selectionEndIndex + indentationSymbolLength));
    }

    outdentCurrentLine() {
        //app.log('outdentCurrentLine');

        var selectionStartIndex = this.getSelectionStartIndex();
        var selectionEndIndex = this.getSelectionEndIndex();
        var selectionStartIndexDelta = 0;
        var selectionEndIndexDelta = 0;
        var valueChanged = false;
        var currentLineText = this.getCurrentLineText();
        var currentLineStartIndex = this.getCurrentLineStartIndex();
        var currentLineEndIndex = this.getCurrentLineEndIndex();
        var currentLineIsEntirelySelected = this.isCurrentLineEntirelySelected();
        var updatedCurrentLineText = null;
        var value = this.getValue();
        var updatedValue = null;
        var indentationSymbol = this.settings.get('indentationSymbol');
        var indentationSymbolLength = indentationSymbol.length;

        //app.log('------');
        //app.log('selectionStartIndex', selectionStartIndex);
        //app.log('selectionEndIndex', selectionEndIndex);
        //app.log('selectionStartIndexDelta', selectionStartIndexDelta);
        //app.log('selectionEndIndexDelta', selectionEndIndexDelta);
        //app.log('currentLineText', currentLineText);
        //app.log('currentLineStartIndex', currentLineStartIndex);
        //app.log('currentLineEndIndex', currentLineEndIndex);
        //app.log('currentLineIsEntirelySelected', currentLineIsEntirelySelected);
        //app.log('updatedCurrentLineText', updatedCurrentLineText);
        //app.log('------');

        // Find the first indentation symbol at the start of the line and remove it
        if(currentLineText.startsWith(indentationSymbol)) {
            // Keep track of how far we are moving our selection
            selectionStartIndexDelta = -indentationSymbolLength;
            selectionEndIndexDelta = -indentationSymbolLength;

            // Replace the first indentation symbol in the string
            updatedCurrentLineText = currentLineText.replaceFirst(indentationSymbol, '');

            // Replace the old line with the new modified line
            updatedValue = value.replaceRange(currentLineStartIndex, currentLineEndIndex, updatedCurrentLineText);

            // Update the text form control value
            this.setValue(updatedValue);

            // Make sure we select range
            valueChanged = true;
        }
        // If the line starts with white space, not an indentation symbol
        else {
            // Get the white space at the start of the string
            var whiteSpaceAtStartOfString = this.getWhiteSpaceAtStartOfString(currentLineText);

            // If the string begins with white space
            if(whiteSpaceAtStartOfString) {
                // Keep track of how far we are moving our selection
                selectionStartIndexDelta = -whiteSpaceAtStartOfString.length;
                selectionEndIndexDelta = -whiteSpaceAtStartOfString.length;

                // Remove the white space at the start of the string
                updatedCurrentLineText = currentLineText.replaceFirst(whiteSpaceAtStartOfString, '');

                // Replace the old line with the new modified line
                updatedValue = value.replaceRange(currentLineStartIndex, currentLineEndIndex, updatedCurrentLineText);

                // Update the text form control value
                this.setValue(updatedValue);

                // Make sure we select range
                valueChanged = true;
            }
        }

        // If the value changed we should update the selection and cursor position
        if(valueChanged) {
            var updatedSelectionStartIndex = selectionStartIndex + selectionStartIndexDelta;
            var updatedSelectionEndIndex = selectionEndIndex + selectionEndIndexDelta;
            //app.log('Range selection', updatedSelectionStartIndex, updatedSelectionEndIndex);

            // If they have the whole line selected, keep the whole line selected
            if(currentLineIsEntirelySelected) {
                this.selectRange(currentLineStartIndex, updatedSelectionEndIndex);
            }
            // Make sure we don't jump back further than the start of the line
            else if(currentLineStartIndex <= (selectionStartIndex + selectionStartIndexDelta)) {
                //app.log('Selecting range', updatedSelectionStartIndex, updatedSelectionEndIndex, selectionStartIndex, selectionStartIndexDelta, selectionEndIndex, selectionEndIndexDelta);
                this.selectRange(updatedSelectionStartIndex, updatedSelectionEndIndex);
            }
            // Just stay at the front of the string
            else {
                //app.log('Setting cursor position', this.getCurrentLineStartIndex());
                this.setCursorIndex(currentLineStartIndex);
            }
        }
    }

    indentSelectedLines() {
        //app.log('indentSelectedLines');

        var selectionStartIndex = this.getSelectionStartIndex();
        var selectionEndIndex = this.getSelectionEndIndex();
        var selectedLinesText = this.getSelectedLinesText();
        var selectedLinesCount = this.getSelectedLinesCount();
        var indentationSymbol = this.settings.get('indentationSymbol');
        var indentationSymbolLength = indentationSymbol.length;
        
        // Add indentation to each selected line
        var updatedSelectedLinesText = '';
        selectedLinesText.split("\n").each(function(index, selectedLineText) {
            updatedSelectedLinesText += indentationSymbol+selectedLineText+"\n";
        });
        updatedSelectedLinesText = updatedSelectedLinesText.replaceLast("\n", '');

        //app.log('selectedLinesText', selectedLinesText);
        //app.log('selectedLinesCount', selectedLinesCount);
        //app.log('updatedSelectedLinesText', updatedSelectedLinesText);
        
        var updatedValue = this.getValue().replaceRange(this.getFirstSelectedLineStartIndex(), this.getLastSelectedLineEndIndex(), updatedSelectedLinesText);

        // Update the text form control value
        this.setValue(updatedValue);

        // Update the selection and cursor position
        this.selectRange((selectionStartIndex + indentationSymbolLength), (selectionEndIndex + (indentationSymbolLength * selectedLinesCount)));
    }

    outdentSelectedLines() {
        //app.log('outdentSelectedLines');

        var selectionStartIndex = this.getSelectionStartIndex();
        var selectionEndIndex = this.getSelectionEndIndex();
        var selectedLinesText = this.getSelectedLinesText();
        var selectedLinesCount = this.getSelectedLinesCount();
        var firstSelectedLineStartIndex = this.getFirstSelectedLineStartIndex();
        var indentationSymbol = this.settings.get('indentationSymbol');
        var indentationSymbolLength = indentationSymbol.length;
        
        // Go through each selected line and remove either the tab character or the white space, keeping track of how many characters have been removed
        var charactersRemoved = 0;
        var charactersRemovedFromFirstLine = 0;
        var updatedSelectedLinesText = '';
        selectedLinesText.split("\n").each(function(index, selectedLineText) {
            // If the line starts with an indentation symbol
            if(selectedLineText.startsWith(indentationSymbol)) {
                charactersRemoved += indentationSymbol.length;

                if(index == 0) {
                    charactersRemovedFromFirstLine = charactersRemoved;
                }

                updatedSelectedLinesText += selectedLineText.replaceFirst(indentationSymbol, '')+"\n";
            }
            // if the line does not start with an indentation symbol
            else {
                // Get the white space at the start of the string
                var whiteSpaceAtStartOfString = this.getWhiteSpaceAtStartOfString(selectedLineText);

                // If the string starts with white space
                if(whiteSpaceAtStartOfString) {
                    // Keep track of how far we are moving our selection
                    charactersRemoved += whiteSpaceAtStartOfString.length;

                    if(index == 0) {
                        charactersRemovedFromFirstLine = charactersRemoved;
                    }

                    // Replace the white space
                    updatedSelectedLinesText += selectedLineText.replaceFirst(whiteSpaceAtStartOfString, '')+"\n";
                }
                // If the string does not start with white space, it is already outdented as much as possible
                else {
                    updatedSelectedLinesText += selectedLineText+"\n";
                }
            }
        }.bind(this));
        updatedSelectedLinesText = updatedSelectedLinesText.replaceLast("\n", '');

        //app.log('selectedLinesText', selectedLinesText);
        //app.log('selectedLinesCount', selectedLinesCount);
        //app.log('updatedSelectedLinesText', updatedSelectedLinesText);
        
        var updatedValue = this.getValue().replaceRange(this.getFirstSelectedLineStartIndex(), this.getLastSelectedLineEndIndex(), updatedSelectedLinesText);

        // Update the text form control value
        this.setValue(updatedValue);

        // Update the selection and cursor position
        var updatedSelectionStartIndex = selectionStartIndex - charactersRemovedFromFirstLine;
        // Never select the line before
        if(updatedSelectionStartIndex < firstSelectedLineStartIndex) {
            updatedSelectionStartIndex = firstSelectedLineStartIndex;
        }
        var updatedSelectionEndIndex = selectionEndIndex - charactersRemoved;
        this.selectRange(updatedSelectionStartIndex, updatedSelectionEndIndex);
    }

    getSelectedText() {
        var selectedText = null;

        if((this.getSelectionEndIndex() - this.getSelectionStartIndex()) > 0) {
            selectedText = this.getValue().substring(this.getSelectionStartIndex(), this.getSelectionEndIndex());
        }

        return selectedText;
    }

    getSelectedLinesCount() {
        var selectionLineCount = 0;
        var selectedText = this.getSelectedText();
        //app.log('selectedText', selectedText);

        if(selectedText) {
            selectionLineCount = selectedText.getLineCount();
        }

        return selectionLineCount;
    }

    getSelectedLinesText() {
        return this.getValue().substring(this.getFirstSelectedLineStartIndex(), this.getLastSelectedLineEndIndex());
    }

    getFirstSelectedLineStartIndex() {
        return this.getCurrentLineStartIndex();
    }

    getLastSelectedLineEndIndex() {
        var lastSelectedLineEndIndex = null;

        var value = this.getValue();

        // If we include the last line
        if(this.doesSelectionContainLastLine()) {
            // Then the last selected line end index is the end of all of the text
            lastSelectedLineEndIndex = value.length;
        }
        // If the selection does not contain the last line
        else {
            // Then the last selected line end index is the selection end index plus the number of characters until the next line break
            lastSelectedLineEndIndex = this.getSelectionEndIndex() + value.substring(this.getSelectionEndIndex()).indexOf("\n");
        }

        return lastSelectedLineEndIndex;
    }

    getSelectionStartIndex() {
        return this.domNode.selectionStart;
    }

    getSelectionEndIndex() {
        return this.domNode.selectionEnd;
    }

    getCurrentLineNumber() {
        return this.getValue().substring(0, this.getSelectionStartIndex()).split("\n").length;
    }

    getCurrentLineStartIndex() {
        return this.getValue().lastIndexOf("\n", this.getSelectionStartIndex() - 1) + 1;
    }

    getCurrentLineEndIndex() {
        var currentLineEndIndex = null;

        var value = this.getValue();

        // If the selection contains the last line
        if(this.doesSelectionContainLastLine()) {
            //app.log('this.doesSelectionContainLastLine()', this.doesSelectionContainLastLine());
            // Then the current line end index is the end of all of the text
            currentLineEndIndex = value.length;
        }
        // If the selection does not contain the last line
        else {
            // Then the current line end index is the current line start index plus the number of characters until the next line break
            currentLineEndIndex = this.getCurrentLineStartIndex() + value.substring(this.getCurrentLineStartIndex()).indexOf("\n");
        }

        // If we still do not have a line end index or if the line end index is -1, then there is only one line of text
        if(currentLineEndIndex === null || currentLineEndIndex == -1) {
            currentLineEndIndex = value.length;
        }

        return currentLineEndIndex;
    }

    getCurrentLineText() {
        return this.getValue().substr(this.getCurrentLineStartIndex(), (this.getCurrentLineEndIndex() - this.getCurrentLineStartIndex()));
    }

    getCurrentLineTextUpToCursorIndex() {
        var currentLineStartIndex = this.getCurrentLineStartIndex();
        var cursorIndex = this.getCursorIndex();

        return this.getValue().substr(currentLineStartIndex, cursorIndex - currentLineStartIndex);
    }

    doesSelectionContainLastLine() {
        return this.getValue().substring(this.getSelectionEndIndex()).indexOf("\n") == -1;
    }

    isCurrentLineEntirelySelected() {
        return (this.getSelectionStartIndex() == this.getCurrentLineStartIndex() && this.getSelectionEndIndex() == this.getCurrentLineEndIndex());
    }

    getCurrentColumnNumber() {
        return this.getSelectionStartIndex() - this.getCurrentLineStartIndex() + 1;
    }
    
	getCursorIndex() {
        var index = 0;

        var index = this.getSelectionStartIndex();

        if(index === undefined) {
            this.domNode.focus();
            var selection = this.viewContainer.getSelection();
            var selectionRange = selection.createRange();
            var selectionLength = selection.createRange().text.length;
            selectionRange.moveStart('character', -this.getValue().length);
            index = selectionRange.text.length - selectionLength;
        }

        return index;
    }

    setCursorIndex(index) {
        this.selectRange(index, index);
    }

    selectRange(start, end) {
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
    }

    getWhiteSpaceAtStartOfString(string) {
        var whiteSpaceAtStartOfString = string.match(/^\s*/).get(0);

        if(!whiteSpaceAtStartOfString) {
            whiteSpaceAtStartOfString = '';
        }

        return whiteSpaceAtStartOfString;
    }

}

// Export
export default TextFormControlView;
