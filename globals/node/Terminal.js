// Class
class Terminal {

    static color(string, colorName) {
    	return Terminal.style(string, colorName);
    }

    static style(string, styles) {
        // Handle if styles are passed in as a comma-separated string
        if(String.is(styles)) {
            let stylesString = styles.split(',');
            styles = [];
            stylesString.each(function(index, style) {
                styles.append(style.trim());
            });
        }

    	// Wrap the string in the styles
    	styles.each(function(index, style) {
    		if(Terminal.ansiStyles[style]) {
    			string = Terminal.ansiStyles[style].open+string+Terminal.ansiStyles[style].close;
    		}
    	});

    	return string;
    }

    static width() {
    	var width;

    	if(app.standardStreams.output.getWindowSize) {
    		width = app.standardStreams.output.getWindowSize()[0];
    	}

    	return width;
    }

    static height() {
    	var height;

    	if(app.standardStreams.output.getWindowSize) {
    		height = app.standardStreams.output.getWindowSize()[1];
    	}

    	return height;
    }

    static eraseDisplay() {
        app.standardStreams.output.write('\x1b[2J\x1b[0f');
    }

    static clear = Terminal.reset = Terminal.eraseDisplay;

    static clearLine() {
        app.standardStreams.output.write('\x1b[2K');
    }

    static clearLineFromCursor() {
        app.standardStreams.output.write('\x1b[1K');
    }

    static cursorToBeginningOfLine() {
        app.standardStreams.output.write('\x1bb');
    }

    static cursorUp(distance = 1) {
        if(distance) {
            app.standardStreams.output.write('\x1b['+distance+'A');
        }    	
    }

    static cursorDown(distance = 1) {
        if(distance) {
            app.standardStreams.output.write('\x1b['+distance+'B');
        }
    	
    }

    static cursorLeft(distance = 1) {
        if(distance) {
            app.standardStreams.output.write('\x1b['+distance+'D');
        }
    }

    static cursorBack = Terminal.cursorLeft;

    static cursorRight(distance = 1) {
        if(distance) {
            app.standardStreams.output.write('\x1b['+distance+'C');
        }
    }

    static cursorForward = Terminal.cursorRight;

    static nextLine(distance = 1) {
    	app.standardStreams.output.write('\x1b['+distance+'E');
    }

    static previousLine(distance = 1) {
    	app.standardStreams.output.write('\x1b['+distance+'F');
    }

    static scrollDown(distance = 1) {
    	app.standardStreams.output.write('\x1b['+distance+'T');
    }

    static scrollUp(distance = 1) {
    	app.standardStreams.output.write('\x1b['+distance+'S');
    }

    static moveCursor(x, y) {
    	// Move left or right
    	if(x > 0) {
    		Terminal.cursorRight(x);
    	}
    	else {
    		Terminal.cursorLeft(x);
    	}

    	// Move up or down
    	if(y > 0) {
    		Terminal.cursorDown(y);
    	}
    	else {
    		Terminal.cursorUp(-y);
    	}
    }

    static moveCursorTo(x, y) {
    	app.standardStreams.output.write('\x1b[' + y + ';' + x + 'H');
    }

    static beep() {
    	app.standardStreams.output.write('\x07');
    }

    static box(text = '', options = {}) {
        options = {
            borderColor: 'white', // TODO: Not implemented
            borderStyle: 'solid', // single, round, double, bold, singleDouble, doubleSingle, classic, arrow
            // borderStyle: { // or, a custom style
            //     topLeft: '+',
            //     topRight: '+',
            //     bottomLeft: '+',
            //     bottomRight: '+',
            //     top: '-',
            //     bottom: '-',
            //     left: '|',
            //     right: '|'
            // },
            title: null,
            titleAlignment: 'left', // left, center, right
            width: null, // TODO: Not implemented
            height: null, // TODO: Not implemented
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
            padding: {
                top: 1,
                right: 3,
                bottom: 1,
                left: 3,
            },
            float: 'left', // left, center, right // TODO: Not implemented
            backgroundColor: null, // TODO: Not implemented
            textAlignment: 'left', // left, center, right  // TODO: Not implemented
        }.merge(options);

        // Handle margin being passed in as a single integer
        if(Number.is(options.margin)) {
            options.margin = {
                top: options.margin,
                right: options.margin,
                bottom: options.margin,
                left: options.margin,
            };
        }

        // Handle padding being passed in as a single integer
        if(Number.is(options.padding)) {
            options.padding = {
                top: options.padding,
                right: options.padding,
                bottom: options.padding,
                left: options.padding,
            };
        }

        // console.log('options', options);

        const borderStyles = {
            solid: { topLeft: '┌', top: '─', topRight: '┐', right: '│', bottomRight: '┘', bottom: '─', bottomLeft: '└', left: '│' },
            double: { topLeft: '╔', top: '═', topRight: '╗', right: '║', bottomRight: '╝', bottom: '═', bottomLeft: '╚', left: '║' },
            round: { topLeft: '╭', top: '─', topRight: '╮', right: '│', bottomRight: '╯', bottom: '─', bottomLeft: '╰', left: '│' },
            bold: { topLeft: '┏', top: '━', topRight: '┓', right: '┃', bottomRight: '┛', bottom: '━', bottomLeft: '┗', left: '┃' },
            solidDouble: { topLeft: '╓', top: '─', topRight: '╖', right: '║', bottomRight: '╜', bottom: '─', bottomLeft: '╙', left: '║' },
            doubleSolid: { topLeft: '╒', top: '═', topRight: '╕', right: '│', bottomRight: '╛', bottom: '═', bottomLeft: '╘', left: '│' },
            classic: { topLeft: '+', top: '-', topRight: '+', right: '|', bottomRight: '+', bottom: '-', bottomLeft: '+', left: '|' },
            arrow: { topLeft: '↘', top: '↓', topRight: '↙', right: '←', bottomRight: '↖', bottom: '↑', bottomLeft: '↗', left: '→' },
        }

        // Get the longest line width
        let longestLineWidth = 0;
        text.toLines().each(function(index, line) {
            // console.log(line.getCharacterCount(), line);
            if(line.length > longestLineWidth) {
                longestLineWidth = line.getCharacterCount();
            }
        });
        // console.log('longestLineWidth', longestLineWidth);

        // Handle title length
        if(options.title) {
            // + 2 is for spaces to the left and right of the title
            if((options.title.length + 2) > longestLineWidth) {
                longestLineWidth = (options.title.length + 2);
            }
        }

        let box = '';

        // Handle top margin
        if(options.margin.top) {
            box += '\n'.repeat(options.margin.top);
        }

        // Handle left margin
        if(options.margin) {
            box += ' '.repeat(options.margin.left);
        }

        // Create the top border
        let topBorder = '';

        // Draw the top left character
        topBorder += borderStyles[options.borderStyle].topLeft;

        // Draw the top border
        topBorder += borderStyles[options.borderStyle].top.repeat(longestLineWidth + (options.padding.left + options.padding.right));

        // Draw the top right character
        topBorder += borderStyles[options.borderStyle].topRight;

        // Inject the title into the top border string
        if(options.title) {
            // Handle title alignment
            if(options.titleAlignment === 'left') {
                topBorder = topBorder.replaceRange(1, options.title.length + 3, ' '+options.title+' ');
            }
            else if(options.titleAlignment === 'center') {
                topBorder = topBorder.replaceRange(((topBorder.length - options.title.length + 2) / 2) - 3, ((topBorder.length - options.title.length + 2) / 2) - 3 + options.title.length + 2, ' '+options.title+' ');
            }
            else if(options.titleAlignment === 'right') {
                topBorder = topBorder.replaceRange(topBorder.length - options.title.length - 3, topBorder.length - 1, ' '+options.title+' ');
            }
        }

        // Add the top border to the box
        box += topBorder;

        // Start a new line
        box += '\n';

        // Draw the left margin
        if(options.margin.left) {
            box += ' '.repeat(options.margin.left);
        }

        // Draw the top padding
        if(options.padding.top) {
            for(let i = 0; i < options.padding.top; i++) {
                // Draw the left margin
                if(i > 0 && options.margin.left) {
                    box += ' '.repeat(options.margin.left);
                }

                // Draw the left border
                box += borderStyles[options.borderStyle].left;

                // Draw the padding
                box += ' '.repeat(longestLineWidth + (options.padding.left + options.padding.right));

                // Draw the right border
                box += borderStyles[options.borderStyle].right;

                // Start a new line
                box += '\n';
            }
        }

        // Draw the text
        text.toLines().each(function(index, line) {
            // console.log('line', line);
            box += ' '.repeat(options.margin.left);
            box += borderStyles[options.borderStyle].left;
            box += ' '.repeat(options.padding.left);
            box += line;
            box += ' '.repeat(options.padding.right + (longestLineWidth - line.length));
            box += borderStyles[options.borderStyle].right;
            box += '\n';
        });

        // Draw the bottom padding
        if(options.padding.bottom) {
            for(let i = 0; i < options.padding.bottom; i++) {
                // Draw the left margin
                if(options.margin.left) {
                    box += ' '.repeat(options.margin.left);
                }

                // Draw the left border
                box += borderStyles[options.borderStyle].left;

                // Draw the padding
                box += ' '.repeat(longestLineWidth + (options.padding.left + options.padding.right));

                // Draw the right border
                box += borderStyles[options.borderStyle].right;

                // Start a new line
                box += '\n';
            }
        }

        // Draw the left margin
        if(options.margin.left) {
            box += ' '.repeat(options.margin.left);
        }

        // Draw the bottom left character
        box += borderStyles[options.borderStyle].bottomLeft;

        // Draw the bottom border
        box += borderStyles[options.borderStyle].bottom.repeat(longestLineWidth + (options.padding.left + options.padding.right));

        // Draw the bottom right character
        box += borderStyles[options.borderStyle].bottomRight;

        // End the line
        box += '\n';

        // Draw the bottom margin
        if(options.margin.bottom) {
            box += '\n'.repeat(options.margin.bottom);
        }

        console.log(box);
    }

    static demonstrateStyles() {
        Terminal.ansiStyles.each(function(style) {
            app.log(Terminal.color('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', style)+' '+style);
        });
    }

    static removeAnsiEscapeCodesFromString(string) {
        return string.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }

    static ansiStyles = {
    	// Text styles
        reset: {
            open: '\u001b[0m',
            close: '\u001b[0m',
        },
        bold: {
            open: '\u001b[1m',
            close: '\u001b[22m',
        },
        dim: {
            open: '\u001b[2m',
            close: '\u001b[22m',
        },
        italic: {
            open: '\u001b[3m',
            close: '\u001b[23m',
        },
        underline: {
            open: '\u001b[4m',
            close: '\u001b[24m',
        },
        inverse: {
            open: '\u001b[7m',
            close: '\u001b[27m',
        },
        hidden: {
            open: '\u001b[8m',
            close: '\u001b[28m',
        },
        strikethrough: {
            open: '\u001b[9m',
            close: '\u001b[29m',
        },

        // Text colors
        black: {
            open: '\u001b[30m',
            close: '\u001b[39m',
        },
        red: {
            open: '\u001b[31m',
            close: '\u001b[39m',
        },
        green: {
            open: '\u001b[32m',
            close: '\u001b[39m',
        },
        yellow: {
            open: '\u001b[33m',
            close: '\u001b[39m',
        },
        blue: {
            open: '\u001b[34m',
            close: '\u001b[39m',
        },
        magenta: {
            open: '\u001b[35m',
            close: '\u001b[39m',
        },
        cyan: {
            open: '\u001b[36m',
            close: '\u001b[39m',
        },
        white: {
            open: '\u001b[37m',
            close: '\u001b[39m',
        },
        gray: {
            open: '\u001b[90m',
            close: '\u001b[39m',
        },

        // Background colors
        blackBackground: {
            open: '\u001b[40m',
            close: '\u001b[49m',
        },
        redBackground: {
            open: '\u001b[41m',
            close: '\u001b[49m',
        },
        greenBackground: {
            open: '\u001b[42m',
            close: '\u001b[49m',
        },
        yellowBackground: {
            open: '\u001b[43m',
            close: '\u001b[49m',
        },
        blueBackground: {
            open: '\u001b[44m',
            close: '\u001b[49m',
        },
        magentaBackground: {
            open: '\u001b[45m',
            close: '\u001b[49m',
        },
        cyanBackground: {
            open: '\u001b[46m',
            close: '\u001b[49m',
        },
        whiteBackground: {
            open: '\u001b[47m',
            close: '\u001b[49m',
        },
    };

}

// Global
global.Terminal = Terminal;
