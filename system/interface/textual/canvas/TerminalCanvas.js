// Dependencies
import { TerminalCanvasCell } from '@framework/system/interface/textual/canvas/TerminalCanvasCell.js';

// Class
class TerminalCanvas {

    fullscreen = true;
    width = null;
    height = null;
    cells = [];
    lastFrame = []; // Holds the previous ANSI sequences sent to the terminal

    // Virtual cursor position
    cursorColumnIndex = null;
    cursorRowIndex = null;

    // Virtual cursor color
    cursorBackgroundColor = {
        red: null,
        green: null,
        blue: null,
    };
    cursorForegroundColor = {
        red: null,
        green: null,
        blue: null,
    };

    // Virtual cursor display modes
    cursorBlink = null;
    cursorBold = null;
    cursorDim = null;
    cursorHidden = null;
    cursorReverse = null;
    cursorUnderlined = null;

	constructor(options = {}) {
        // Parse options
        if(options.fullscreen) { this.fullscreen = options.fullscreen; }
        if(options.width) { this.width = options.width; }
        if(options.height) { this.height = options.height; }

        // If fullscreen, use the full dimensions of the terminal
        if(this.fullscreen) {
            this.enableFullscreen();
        }

        // Create the cells and let frame
        for(let rowIndex = 1; rowIndex <= this.height; rowIndex++) {
            let row = [];
            let lastFrameRow = [];
            for(var columnIndex = 1; columnIndex <= this.width; columnIndex++) {
                row[columnIndex] = new TerminalCanvasCell(columnIndex, rowIndex);
                lastFrameRow[columnIndex] = '';
            }
            this.cells[rowIndex] = row;
            this.lastFrame[rowIndex] = lastFrameRow;
        }
    }

    enableFullscreen() {
        // Set the fullscreen flag
        this.fullscreen = true;
        this.width = Terminal.getWidth();
        this.height = Terminal.getHeight();
    }

    // This writes changes to the cells which are not rendered until the next render call
    write(string) {
        // console.log('write');

        // Write character by character into each cell
        for(let i = 0; i < string.length; i++) {
            // If the cursor is in bounds
            if(this.cursorColumnIndex >= 1 && this.cursorColumnIndex <= this.width && this.cursorRowIndex >= 1 && this.cursorRowIndex <= this.height) {
                let cell = this.cells[this.cursorRowIndex][this.cursorColumnIndex];
                let character = string.characterAt(i);
                cell.setCharacter(character);
                // console.log('writing', character, 'to', this.cursorColumnIndex, this.cursorRowIndex, cell);

                // Colors
                cell.setBackgroundColor(this.cursorBackgroundColor.red, this.cursorBackgroundColor.green, this.cursorBackgroundColor.blue);
                cell.setForegroundColor(this.cursorForegroundColor.red, this.cursorForegroundColor.green, this.cursorForegroundColor.blue);

                // Display modes
                cell.setBold(this.cursorBold);
                cell.setDim(this.cursorDim);
                cell.setUnderlined(this.cursorUnderlined);
                cell.setBlink(this.cursorBlink);
                cell.setReverse(this.cursorReverse);
                cell.setHidden(this.cursorHidden);
            }
            else {
                break;
            }

            // Move to the right
            this.cursorColumnIndex += 1;
        }
    }

    render() {
        let renderString = '';

        // Loop through all of the cells
        for(let rowIndex = 1; rowIndex <= this.height; rowIndex++) {
            for(let columnIndex = 1; columnIndex <= this.width; columnIndex++) {
                // console.log('render', 'rowIndex', rowIndex, 'columnIndex', columnIndex);
                let cell = this.cells[rowIndex][columnIndex];

                // If the cell is modified
                if(cell.modified) {
                    // We are processing this cell, so we mark it as no longer modified
                    cell.modified = false;

                    // console.log('cell at', columnIndex, rowIndex, 'is modified', this.cells[rowIndex][columnIndex]);

                    // Get the string which includes ANSI sequences for the cell
                    let cellString = cell.toString();
                    // console.log('rendering', cellString);

                    // If the cell string is different from the last frame
                    if(cellString !== this.lastFrame[rowIndex][columnIndex]) {
                        // console.log('cell string is different from last frame');

                        // Update the last frame
                        this.lastFrame[rowIndex][columnIndex] = cellString;

                        // Add the cell string to the render string
                        renderString += cellString;
                    }
                }
            }
        }

        // Write out the render string to the terminal
        Terminal.write(renderString);
    }

    onResize() {

    }

    clear() {
        for(let rowIndex = 1; rowIndex <= this.height; rowIndex++) {
            for(let columnIndex = 1; columnIndex <= this.width; columnIndex++) {
                this.cells[rowIndex][columnIndex].clear();
            }
        }

        this.render();
    }

    clearLine() {
        for(let columnIndex = 1; columnIndex < this.width; columnIndex++) {
            this.cells[this.cursorRowIndex][columnIndex].clear();
        }
    }

    setCursorPosition(columnIndex, rowIndex) {
        // console.log('setCursorPosition', columnIndex, rowIndex);

        this.cursorColumnIndex = Math.floor(columnIndex);
        this.cursorRowIndex = Math.floor(rowIndex);
    }

}

// Export
export { TerminalCanvas };
