// Class
var Terminal = {};

Terminal.write = function(data) {
    Node.StandardOut.write(data);
};

Terminal.color = function(string, colorName) {
	return Terminal.style(string, colorName);
};

Terminal.style = function(string, stylesString) {
	// Get all of the styles from the stylesString
	var styles = [];
	stylesString.split(',').each(function(index, style) {
		styles.push(style.trim());
	});

	// Wrap the string in the styles
	styles.each(function(index, style) {
		if(Terminal.ansiStyles[style]) {
			string = Terminal.ansiStyles[style].open+string+Terminal.ansiStyles[style].close;
		}
	});

	return string;
};

Terminal.width = function() {
	var width;

	if(Node.Process.stdout.getWindowSize) {
		width = Node.Process.stdout.getWindowSize()[0];
	}

	return width;
};

Terminal.height = function() {
	var height;

	if(Node.Process.stdout.getWindowSize) {
		height = Node.Process.stdout.getWindowSize()[1];
	}

	return height;
};

Terminal.eraseDisplay = function() {
	Terminal.write('\033[2J\033[0f');
};

Terminal.clear = Terminal.reset = Terminal.eraseDisplay;

Terminal.clearLine = function() {
    Terminal.write('\033[2K');
}

Terminal.clearLineFromCursor = function() {
    Terminal.write('\033[1K');
}

Terminal.cursorToBeginningOfLine = function() {
    Terminal.write('\033b');
};

Terminal.cursorUp = function(distance) {
    if(distance === 0) {
        return;
    }

	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'A');
};

Terminal.cursorDown = function(distance) {
    if(distance === 0) {
        return;
    }

	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'B');
};

Terminal.cursorLeft = function(distance) {
    if(distance === 0) {
        return;
    }

	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'D');
};

Terminal.cursorBack = Terminal.cursorLeft;

Terminal.cursorRight = function(distance) {
    if(distance === 0) {
        return;
    }

	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'C');
};

Terminal.cursorForward = Terminal.cursorRight;

Terminal.nextLine = function(distance) {
	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'E');
};

Terminal.previousLine = function(distance) {
	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'F');
};

Terminal.scrollDown = function(distance) {
	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'T');
};

Terminal.scrollUp = function(distance) {
	distance = (distance === undefined ? 1 : distance);
	Terminal.write('\x1b['+distance+'S');
};

Terminal.moveCursor = function(x, y) {
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
};

Terminal.moveCursorTo = function(x, y) {
	Terminal.write('\x1b[' + y + ';' + x + 'H');
};

Terminal.beep = function() {
	Terminal.write('\x07');
};

Terminal.demonstrateStyles = function() {
    Terminal.ansiStyles.each(function(style) {
        Console.log(Terminal.color('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', style)+' '+style);
    });
}

Terminal.removeAnsiEscapeCodesFromString = function(string) {
    return string.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

Terminal.ansiStyles = {
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

// Export
module.exports = Terminal;