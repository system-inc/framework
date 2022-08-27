// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { AsciiBox } from '@framework/system/ascii/AsciiBox.js';

// Class
class AsciiBoxTest extends Test {

    async test() {
        return; // Skip test

        let box = null;

        box = new AsciiBox('This content is longer than the title.', {
            title: 'Hello World',
        });
        console.log(box.toString());

        box = new AsciiBox('This box has a title that is centered.', {
            title: 'Title',
            titleAlignment: 'center',
        });
        console.log(box.toString());

        box = new AsciiBox('This box has a title that is aligned to the right.', {
            title: 'Title',
            titleAlignment: 'right',
        });
        console.log(box.toString());

        box = new AsciiBox('This box\nhas a cyan title\nwith cyan content\nwith a white background\nwhich is aligned\nto the\nleft.', {
            title: 'Testing Various ASCII Box Features for Fun',
            titleAlignment: 'left',
            titleColor: 'cyan',
            contentAlignment: 'left',
            contentColor: 'cyan',
            backgroundColor: 'white',
        });
        console.log(box.toString());

        box = new AsciiBox('This box\nhas a magenta title\nwith magenta content\nwith a white background\nwhich is aligned\nto the\ncenter.', {
            title: 'Testing Various ASCII Box Features for Fun',
            titleAlignment: 'center',
            titleColor: 'magenta',
            contentAlignment: 'center',
            contentColor: 'magenta',
            backgroundColor: 'white',
        });
        console.log(box.toString());

        box = new AsciiBox('This box\nhas a red title\nwith red content\nwith a white background\nwhich is aligned\nto the\nright.', {
            title: 'Testing Various ASCII Box Features for Fun',
            titleAlignment: 'right',
            titleColor: 'red',
            contentAlignment: 'right',
            contentColor: 'red',
            backgroundColor: 'white',
        });
        console.log(box.toString());

        AsciiBox.flourishes.each(function(flourishKey, flourishValue) {
            box = new AsciiBox('Flourish: '+flourishKey, {
                flourish: flourishKey,
                // titleColor: 'red',
            });
            console.log(box.toString());
        });

        AsciiBox.titleFlourishes.each(function(titleFlourishKey, titleFlourishValue) {
            box = new AsciiBox('Flourish: '+titleFlourishKey, {
                title: 'Flourished Title',
                titleFlourish: titleFlourishKey,
                // titleColor: 'red',
            });
            console.log(box.toString());
        });
    }

}

// Export
export { AsciiBoxTest };
