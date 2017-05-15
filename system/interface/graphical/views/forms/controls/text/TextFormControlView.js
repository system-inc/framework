// Dependencies
import FormControlView from 'framework/system/interface/graphical/views/forms/controls/FormControlView.js';

// Class
class TextFormControlView extends FormControlView {

    settings = this.settings.mergeDefaults({
        indentationSymbol: '    ', // four spaces
        tabKeyInsertsIndentationSymbol: false,
        indentationManagement: false,
    });

    constructor(settings) {
        super(settings);

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
        //console.log('setValue', value);

        // TODO: If we are programatically changing the value of the control (as below with indentation management), we should make sure that undo still works perfectly

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
        app.interfaces.graphical.adapter.htmlDocument.insertText(text);
    }

    handleInputKeyTabDown(event) {
        //console.log('handleInputKeyTabDown', event);

        var eventReturnValue = true;

        // Prevent the default behavior from happening (changing focus to the next element)
        event.preventDefault();

        // If tabKeyInsertsIndentationSymbol is enabled and indentationManagement is not enabled
        if(this.settings.get('tabKeyInsertsIndentationSymbol') && !this.settings.get('indentationManagement')) {
            // When the user presses tab, insert an indentation symbol regardless of selection or if the shift key is pressed
            //console.log('Inserting tab character, indendation management is off');
            this.insertIndentationSymbol();
        }
        // If indentation management is enabled
        else if(this.settings.get('indentationManagement')) {
            //console.log('indentation management is on');

            eventReturnValue = false;

            // Get the selection text
            var selectedText = this.getSelectedText();

            // If nothing is selected
            if(selectedText === null) {
                // Shift+tab with nothing selected, outdent the current line
                if(event.modifierKeysDown.shift) {
                    //console.log('Tab with nothing selected, outdenting current line');
                    this.outdentCurrentLine();
                }
                // Tab with nothing selected, insert an indentation symbol
                else {
                    //console.log('Tab with nothing selected, insert an indentation symbol');
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
        app.interfaces.graphical.insertText(this.settings.get('indentationSymbol'));
    }

    indentCurrentLine() {
        //console.log('indentCurrentLine');

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
        //console.log('outdentCurrentLine');

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

        //console.log('------');
        //console.log('selectionStartIndex', selectionStartIndex);
        //console.log('selectionEndIndex', selectionEndIndex);
        //console.log('selectionStartIndexDelta', selectionStartIndexDelta);
        //console.log('selectionEndIndexDelta', selectionEndIndexDelta);
        //console.log('currentLineText', currentLineText);
        //console.log('currentLineStartIndex', currentLineStartIndex);
        //console.log('currentLineEndIndex', currentLineEndIndex);
        //console.log('currentLineIsEntirelySelected', currentLineIsEntirelySelected);
        //console.log('updatedCurrentLineText', updatedCurrentLineText);
        //console.log('------');

        // Find the first indentation symbol at the start of the line and remove it
        if(currentLineText.startsWith(indentationSymbol)) {
            //console.log('Current line starts with indentation symbol');

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
            //console.log('Current line does not start with indentation symbol');

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
            //console.log('Line changed, we should move cursor');

            var updatedSelectionStartIndex = selectionStartIndex + selectionStartIndexDelta;
            var updatedSelectionEndIndex = selectionEndIndex + selectionEndIndexDelta;
            //console.log('Range selection', updatedSelectionStartIndex, updatedSelectionEndIndex);

            // If they have the whole line selected, keep the whole line selected
            if(currentLineIsEntirelySelected) {
                //console.log('Current line is entirely selected');
                this.selectRange(currentLineStartIndex, updatedSelectionEndIndex);
            }
            // Make sure we don't jump back further than the start of the line
            else if(currentLineStartIndex <= (selectionStartIndex + selectionStartIndexDelta)) {
                //console.log('Selecting range', updatedSelectionStartIndex, updatedSelectionEndIndex, selectionStartIndex, selectionStartIndexDelta, selectionEndIndex, selectionEndIndexDelta);
                this.selectRange(updatedSelectionStartIndex, updatedSelectionEndIndex);
            }
            // Just stay at the front of the string
            else {
                //console.log('Setting cursor position', this.getCurrentLineStartIndex());
                this.setCursorIndex(currentLineStartIndex);
            }
        }
    }

    indentSelectedLines() {
        //console.log('indentSelectedLines');

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

        //console.log('selectedLinesText', selectedLinesText);
        //console.log('selectedLinesCount', selectedLinesCount);
        //console.log('updatedSelectedLinesText', updatedSelectedLinesText);
        
        var updatedValue = this.getValue().replaceRange(this.getFirstSelectedLineStartIndex(), this.getLastSelectedLineEndIndex(), updatedSelectedLinesText);

        // Update the text form control value
        this.setValue(updatedValue);

        // Update the selection and cursor position
        this.selectRange((selectionStartIndex + indentationSymbolLength), (selectionEndIndex + (indentationSymbolLength * selectedLinesCount)));
    }

    outdentSelectedLines() {
        //console.log('outdentSelectedLines');

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

        //console.log('selectedLinesText', selectedLinesText);
        //console.log('selectedLinesCount', selectedLinesCount);
        //console.log('updatedSelectedLinesText', updatedSelectedLinesText);
        
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
        //console.log('selectedText', selectedText);

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
        //console.info('this.adapter.adaptedView.domNode.selectionStart', this.adapter.adaptedView.domNode.selectionStart);
        return this.adapter.adaptedView.domNode.selectionStart;
    }

    getSelectionEndIndex() {
        return this.adapter.adaptedView.domNode.selectionEnd;
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
            //console.log('this.doesSelectionContainLastLine()', this.doesSelectionContainLastLine());
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
        var index = this.getSelectionStartIndex();

        // This is broken, this selection.createRange does not exist
        //if(index === undefined) {
        //    this.focus();
        //    var selection = app.interfaces.graphical.getSelection();
        //    var selectionRange = selection.createRange();
        //    var selectionLength = selection.createRange().text.length;
        //    selectionRange.moveStart('character', -this.getValue().length);
        //    index = selectionRange.text.length - selectionLength;
        //}

        return index;
    }

    setCursorIndex(index) {
        this.selectRange(index, index);
    }

    selectRange(start, end) {
        //console.log('selectRange arguments start', start, 'end', end);

        if(end === undefined) {
            end = start;
        }

        if(start == -1) {
            start = this.getValue().length;
        }

        if(end == -1) {
            end = this.getValue().length;
        }

        //console.log('selectRange start', start, 'end', end);

        this.focus();
        this.setSelectionRange(start, end);
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
