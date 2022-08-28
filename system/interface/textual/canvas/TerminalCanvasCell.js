// Dependencies


// Class
class TerminalCanvasCell {

    // Position
    columnIndex = null;
    rowIndex = null;

    character = ' ';

    // Colors
    backgroundColor = {
        red: null,
        green: null,
        blue: null,
    };
    foregroundColor = {
        red: null,
        green: null,
        blue: null,
    };

    // Display modes
    bold = null;
    dim = null;
    underlined = null;
    blink = null;
    reverse = null;
    hidden = null;

    modified = false;

	constructor(columnIndex, rowIndex) {
        this.columnIndex = columnIndex;
        this.rowIndex = rowIndex;
    }

    setCharacter(character) {
        if(character !== this.character) {
            this.character = character;
            this.modified = true;
        }
    }

    setBackgroundColor(red, green, blue) {
        if(red !== this.backgroundColor.red || green !== this.backgroundColor.green || blue !== this.backgroundColor.blue) {
            this.backgroundColor.red = red;
            this.backgroundColor.green = green;
            this.backgroundColor.blue = blue;
            this.modified = true;
        }
    }

    setForegroundColor(red, green, blue) {
        if(red !== this.foregroundColor.red || green !== this.foregroundColor.green || blue !== this.foregroundColor.blue) {
            this.foregroundColor.red = red;
            this.foregroundColor.green = green;
            this.foregroundColor.blue = blue;
            this.modified = true;
        }
    }

    setBold(enabled) {
        if(enabled !== this.bold) {
            this.bold = enabled;
            this.modified = true;
        }
    }

    setDim(enabled) {
        if(enabled !== this.dim) {
            this.dim = enabled;
            this.modified = true;
        }
    }

    setUnderlined(enabled) {
        if(enabled !== this.underlined) {
            this.underlined = enabled;
            this.modified = true;
        }
    }

    setBlink(enabled) {
        if(enabled !== this.blink) {
            this.blink = enabled;
            this.modified = true;
        }
    }

    setReverse(enabled) {
        if(enabled !== this.reverse) {
            this.reverse = enabled;
            this.modified = true;
        }
    }

    setHidden(enabled) {
        if(enabled !== this.hidden) {
            this.hidden = enabled;
            this.modified = true;
        }
    }

    clear() {
        this.setCharacter(' ');
        this.setBackgroundColor(null, null, null);
        this.setForegroundColor(null, null, null);
        this.setBold(null);
        this.setDim(null);
        this.setUnderlined(null);
        this.setBlink(null);
        this.setReverse(null);
        this.setHidden(null);
    }

    toString() {
        let string = '';

        // Move the cursor to the row and column
        string += TerminalCanvasCell.encodeToVt100(`[${this.rowIndex};${this.columnIndex}f`);

        // Set the background color
        if(this.backgroundColor.red !== null) {
            string += TerminalCanvasCell.encodeToVt100(`[48;2;${this.backgroundColor.red};${this.backgroundColor.green};${this.backgroundColor.blue}m`);
        }
        
        // Set the foreground color
        if(this.foregroundColor.red !== null) {
            string += TerminalCanvasCell.encodeToVt100(`[38;2;${this.foregroundColor.red};${this.foregroundColor.green};${this.foregroundColor.blue}m`);
        }

        // Set bold
        if(this.bold) {
            string += TerminalCanvasCell.encodeToVt100(`[${TerminalCanvasCell.displayModes.bold}m`);
        }

        // Set dim
        if(this.dim) {
            string += TerminalCanvasCell.encodeToVt100(`[${TerminalCanvasCell.displayModes.dim}m`);
        }

        // Set underlined
        if(this.underlined) {
            string += TerminalCanvasCell.encodeToVt100(`[${TerminalCanvasCell.displayModes.underlined}m`);
        }

        // Set blink
        if(this.blink) {
            string += TerminalCanvasCell.encodeToVt100(`[${TerminalCanvasCell.displayModes.blink}m`);
        }

        // Set reverse
        if(this.reverse) {
            string += TerminalCanvasCell.encodeToVt100(`[${TerminalCanvasCell.displayModes.reverse}m`);
        }

        // Set hidden
        if(this.hidden) {
            string += TerminalCanvasCell.encodeToVt100(`[${TerminalCanvasCell.displayModes.hidden}m`);
        }

        // Character
        if(this.character) {
            string += this.character;
        }

        // Reset the display modes
        string += TerminalCanvasCell.encodeToVt100(`[${TerminalCanvasCell.displayModes.resetAll}m`);

        return string;
    }

    static encodeToVt100(code) {
        return `\u001b${code}`;
    }

    static displayModes = {
        resetAll: 0,
        bold: 1,
        dim: 2,
        underlined: 4,
        blink: 5,
        reverse: 7,
        hidden: 8,
        resetBold: 21,
        resetDim: 22,
        resetUnderlined: 24,
        resetBlink: 25,
        resetReverse: 27,
        resetHidden: 28,
    };

}

// Export
export { TerminalCanvasCell };
