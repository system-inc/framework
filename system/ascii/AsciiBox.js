// TODO: Implement border width
// TODO: Implement border colors, top right bottom left
// TODO: Implement custom border styles, allowing users to pass in their own object

// Dependencies

// Class
class AsciiBox {

    // Title and content
    title = null;
    titleWrap = ' '; // Characters to put to the left and right of the title
    titleAlignment = 'left'; // left, center, right
    titleColor = null;
    content = null;
    contentLines = null;
    contentAlignment = 'left'; // left, center, right  // TODO: Not implemented
    contentColor = null;
    backgroundColor = null;

    // Border
    borderStyle = 'solid';
    borderWidth = 1;
    borderColor = {
        top: null,
        right: null,
        bottom: null,
        left: null,
    };
    flourish = null;

    // Dimensions and offsets
    width = null;
    height = null;
    contentWidth = null;
    contentHeight = null;
    margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    padding = {
        top: 1,
        right: 3,
        bottom: 1,
        left: 3,
    };

    constructor(content, options = {}) {
        this.content = content;
        this.contentLines = content.toLines();
        this.initialize(options);
    }

    initialize(options) {
        // Margin
        if(options.margin) {
            this.margin = AsciiBox.createOffsetObject(options.margin);
        }

        // Padding
        if(options.padding) {
            this.padding = AsciiBox.createOffsetObject(options.padding);
        }

        // Title color
        if(options.titleColor) {
            this.titleColor = options.titleColor;
        }

        // Title
        if(options.title) {
            this.title = options.title;
        }
        // Surround the title in spaces
        this.title = this.title;

        // Title alignment
        if(options.titleAlignment) {
            this.titleAlignment = options.titleAlignment;
        }

        // Content alignment
        if(options.contentAlignment) {
            this.contentAlignment = options.contentAlignment;
        }

        // Content color
        if(options.contentColor) {
            this.contentColor = options.contentColor;
        }

        // Background color
        if(options.backgroundColor) {
            this.backgroundColor = options.backgroundColor;
        }

        // Flourish
        if(options.flourish) {
            this.flourish = options.flourish;
            this.title = AsciiBox.flourishes[this.flourish];
            this.titleAlignment = 'center';
            this.titleWrap = '';
        }

        // Title flourish
        if(options.titleFlourish) {
            this.titleFlourish = options.titleFlourish;
            this.title = AsciiBox.titleFlourishes[this.titleFlourish].replace('TITLE', this.title);
            this.titleWrap = '';
        }

        // Set the dimensions
        this.setDimensions();
    }

    setDimensions() {
        // Set the content height
        this.contentHeight = this.contentLines.length;

        // Set the content width to the length of the longest line of content
        this.contentLines.each(function(index, line) {
            let lineCharacterCount = line.getCharacterCount(); // This strips ANSI escape sequences
            if(lineCharacterCount > this.contentWidth) {
                this.contentWidth = lineCharacterCount;
            }
        }.bind(this));

        // If the title width is longer than the longest content line width
        if(this.title !== null && (this.title.length + (this.titleWrap.length * 2)) > this.contentWidth) {
            this.contentWidth = this.title.length + (this.titleWrap.length * 2) - this.padding.left - this.padding.right;
        }

        // Width is left border width, left padding, content width, right padding, right border width
        this.width = this.borderWidth + this.padding.left + this.contentWidth + this.padding.right + this.borderWidth;

        // Height is top border width, top padding, content height, bottom padding, bottom border width
        this.height = this.borderWidth + this.padding.top + this.contentLines.length + this.padding.bottom + this.borderWidth;
    }

    toString() {
        // console.log(this);

        let string = '';

        let marginSpacer = ' ';
        let contentSpacer = ' ';

        // Optionally add background color
        if(this.backgroundColor) {
            contentSpacer = Terminal.style(contentSpacer, this.backgroundColor+'Background');
        }

        // Handle top margin
        if(this.margin.top) {
            string += '\n'.repeat(this.margin.top);
        }

        // Handle left margin
        if(this.margin.left) {
            string += marginSpacer.repeat(this.margin.left);
        }

        // Create the top border
        let topBorder = '';

        // Draw the top left character
        topBorder += AsciiBox.borderStyles[this.borderStyle].topLeft;

        // Draw the top border
        topBorder += AsciiBox.borderStyles[this.borderStyle].top.repeat(this.padding.left + this.contentWidth + this.padding.right);

        // Draw the top right character
        topBorder += AsciiBox.borderStyles[this.borderStyle].topRight;

        // Inject the title into the top border string
        if(this.title) {
            // Handle colored titles
            let title = this.title;
            if(this.titleColor) {
                title = Terminal.color(this.title, this.titleColor);
            }

            // Handle title alignment
            if(this.titleAlignment === 'left') {
                topBorder = topBorder.replaceRange(1, this.title.length + (this.titleWrap.length * 2) + 1, this.titleWrap+title+this.titleWrap);
            }
            else if(this.titleAlignment === 'center') {
                // If the title length is equal to the content width and padding, we have no room to center in
                if((this.title.length + (this.titleWrap.length * 2)) == (this.contentWidth + this.padding.left + this.padding.right)) {
                    topBorder = topBorder.replaceRange(1, this.title.length + (this.titleWrap.length * 2) + 1, this.titleWrap+title+this.titleWrap);
                }
                // If not, calculate the center location to place the title
                else {
                    topBorder = topBorder.replaceRange(((topBorder.length - this.title.length - (this.titleWrap.length * 2)) / 2) - 1, ((topBorder.length - this.title.length - (this.titleWrap.length * 2)) / 2) - 1 + this.title.length + (this.titleWrap.length * 2), this.titleWrap+title+this.titleWrap);
                }
            }
            else if(this.titleAlignment === 'right') {
                topBorder = topBorder.replaceRange(topBorder.length - this.title.length - (this.titleWrap.length * 2) - 1, topBorder.length - 1, this.titleWrap+title+this.titleWrap);
            }
        }

        // Add the top border to the string
        string += topBorder;

        // Start a new line
        string += '\n';

        // Draw the left margin
        if(this.margin.left) {
            string += marginSpacer.repeat(this.margin.left);
        }

        // Draw the top padding
        if(this.padding.top) {
            for(let i = 0; i < this.padding.top; i++) {
                // Draw the left margin
                if(i > 0 && this.margin.left) {
                    string += marginSpacer.repeat(this.margin.left);
                }

                // Draw the left border
                string += AsciiBox.borderStyles[this.borderStyle].left;

                // Draw the padding
                string += contentSpacer.repeat(this.contentWidth + (this.padding.left + this.padding.right));

                // Draw the right border
                string += AsciiBox.borderStyles[this.borderStyle].right;

                // Start a new line
                string += '\n';
            }
        }

        // Draw the text
        this.contentLines.each(function(lineIndex, line) {
            // Store the line length in case we modify it by adding color
            let lineLength = line.getCharacterCount();
            
            // Optionally add color
            if(this.contentColor) {
                line = Terminal.color(line, this.contentColor);
            }

            // Optionally add background color
            if(this.backgroundColor) {
                line = Terminal.style(line, this.backgroundColor+'Background');
            }

            // console.log('line', line);
            // Draw the left margin
            string += contentSpacer.repeat(this.margin.left);

            // Draw the left border
            string += AsciiBox.borderStyles[this.borderStyle].left;

            // Content aligned to the left
            if(this.contentAlignment === 'left') {
                string += contentSpacer.repeat(this.padding.left);
                string += line;
                string += contentSpacer.repeat(this.padding.right + (this.contentWidth - lineLength));
            }
            // Content aligned to the center
            else if(this.contentAlignment === 'center') {
                let leftOffset = Math.ceil(this.contentWidth - lineLength) / 2;
                let rightOffset = leftOffset;

                // Handle half cells, skew to the right instead of left
                if(leftOffset % 1 !== 0) {
                    leftOffset = Math.ceil(leftOffset);
                    rightOffset = Math.floor(rightOffset);
                }
                // console.log(leftOffset, rightOffset);

                string += contentSpacer.repeat(this.padding.left);
                string += contentSpacer.repeat(leftOffset);
                string += line;
                string += contentSpacer.repeat(rightOffset);
                string += contentSpacer.repeat(this.padding.right);
            }
            // Content aligned to the right
            else if(this.contentAlignment === 'right') {
                string += contentSpacer.repeat(this.padding.left + (this.contentWidth - lineLength));
                string += line;
                string += contentSpacer.repeat(this.padding.right);
            }

            // Draw the right border
            string += AsciiBox.borderStyles[this.borderStyle].right;
            string += '\n';
        }.bind(this));

        // Draw the bottom padding
        if(this.padding.bottom) {
            for(let i = 0; i < this.padding.bottom; i++) {
                // Draw the left margin
                if(this.margin.left) {
                    string += marginSpacer.repeat(this.margin.left);
                }

                // Draw the left border
                string += AsciiBox.borderStyles[this.borderStyle].left;

                // Draw the padding
                string += contentSpacer.repeat(this.contentWidth + (this.padding.left + this.padding.right));

                // Draw the right border
                string += AsciiBox.borderStyles[this.borderStyle].right;

                // Start a new line
                string += '\n';
            }
        }

        // Draw the left margin
        if(this.margin.left) {
            string += marginSpacer.repeat(this.margin.left);
        }

        // Draw the bottom left character
        string += AsciiBox.borderStyles[this.borderStyle].bottomLeft;

        // Draw the bottom border
        string += AsciiBox.borderStyles[this.borderStyle].bottom.repeat(this.contentWidth + (this.padding.left + this.padding.right));

        // Draw the bottom right character
        string += AsciiBox.borderStyles[this.borderStyle].bottomRight;

        // End the line
        string += '\n';

        // Draw the bottom margin
        if(this.margin.bottom) {
            string += '\n'.repeat(this.margin.bottom);
        }

        return string;
    }

    toArray() {
        let array = [];

        this.toString().toLines().each(function(lineIndex, line) {
            array[lineIndex] = [];
            
            line.each(function(characterIndex, character) {
                array[lineIndex].push(character);
            });
        });

        return array;
    }

    static borderStyles = {
        solid: { topLeft: '┌', top: '─', topRight: '┐', right: '│', bottomRight: '┘', bottom: '─', bottomLeft: '└', left: '│' },
        double: { topLeft: '╔', top: '═', topRight: '╗', right: '║', bottomRight: '╝', bottom: '═', bottomLeft: '╚', left: '║' },
        round: { topLeft: '╭', top: '─', topRight: '╮', right: '│', bottomRight: '╯', bottom: '─', bottomLeft: '╰', left: '│' },
        bold: { topLeft: '┏', top: '━', topRight: '┓', right: '┃', bottomRight: '┛', bottom: '━', bottomLeft: '┗', left: '┃' },
        solidDouble: { topLeft: '╓', top: '─', topRight: '╖', right: '║', bottomRight: '╜', bottom: '─', bottomLeft: '╙', left: '║' },
        doubleSolid: { topLeft: '╒', top: '═', topRight: '╕', right: '│', bottomRight: '╛', bottom: '═', bottomLeft: '╘', left: '│' },
        classic: { topLeft: '+', top: '-', topRight: '+', right: '|', bottomRight: '+', bottom: '-', bottomLeft: '+', left: '|' },
        arrow: { topLeft: '↘', top: '↓', topRight: '↙', right: '←', bottomRight: '↖', bottom: '↑', bottomLeft: '↗', left: '→' },
    }

	static flourishes = {
        star: '《✧》',
        dotStar: '•✧•',
        fancy: ' ∘°❉°∘ ',
        elegant: '∘°❉°∘',
        dots: '•●•',
        solar: '*.·:·.✧ ✦ ✧.·:·.*',
        superSolar: '* . °•★|•°∵ ∵°•|☆•° . *',
        heart: ' ❤ ',
        decadent: '.·:*¨༺ ༻¨*:·.',
        interval: '●・○・●・○・●',
        festive: 'ˋˏ ༻❁༺ ˎˊ',
        flower: '❛ ━━･❪ ❁ ❫ ･━━ ❜',
        diamond: '◈━◈━◈━◈━◈',
        doubleCircles: ' ━◦○◦━◦○◦━ ',
        japanTop: ' ❉ ╤╤╤╤ ✿ ╤╤╤╤ ❉ ',
        japanBottom: ' ❉ ╧╧╧╧ ✿ ╧╧╧╧ ❉ ',
        squareCircle: ' ▣ ◎ ▣ ',
        triangleDiamond: '❢◥ ▬▬▬ ◆ ▬▬▬ ◤❢',
    };

    static titleFlourishes = {
        hearts: ' ❤ TITLE ❤ ',
        dots: '•●• TITLE •●•',
        japan: ' ❉ ╤╤╤╤ TITLE ╤╤╤╤ ❉ ',
        squares: ' ▣ TITLE ▣ ',
    };

    static createOffsetObject(offset) {
        let offsetObject = {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        }

        // Handle single numbers
        if(Number.is(offsetObject)) {
            offset.top = offsetObject;
            offset.right = offsetObject;
            offset.bottom = offsetObject;
            offset.left = offsetObject;
        }
        // Handle strings, similar to CSS
        else if(String.is(offsetObject)) {
            let offsetParts = offset.split(' ');
            if(offsetParts.length == 1) {
                offsetObject.top = offsetObject.right = offsetObject.bottom = offsetObject.left = offsetParts[0];
            }
            else if(offsetParts.length == 2) {
                offset.top = Number(offsetObject[0]);
                offset.right = Number(offsetObject[1]);
                offset.bottom = Number(offsetObject[0]);
                offset.left = Number(offsetObject[1]);
            }
            else if(offsetParts.length == 4) {
                offset.top = Number(offsetObject[0]);
                offset.right = Number(offsetObject[1]);
                offset.bottom = Number(offsetObject[2]);
                offset.left = Number(offsetObject[3]);
            }
        }
        // Handle objects
        else if(Object.is(offset)) {
            offsetObject = offset;
        }

        return offsetObject;
    }

}

// Export
export { AsciiBox };
