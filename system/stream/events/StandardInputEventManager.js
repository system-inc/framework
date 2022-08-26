// Dependencies
import { StandardInputPressEvent } from '@framework/system/stream/events/StandardInputPressEvent.js';
import { StandardInputDragEvent } from '@framework/system/stream/events/StandardInputDragEvent.js';

// Class
class StandardInputEventManager {

    stream = null;

    activeInputPressDownEvent = null;
    activeInputDragStartEvent = null;
    lastTimeInputPressUpHappened = null;
    currentInputPressCount = null;

    constructor(stream) {
        this.stream = stream;

        this.listen();

        console.log('draw a line on the screen');
        console.log('draw a box on the screen');
        console.log('draw a circle on the screen');
        console.log('test all keys like ! and fix 1 2 3 keys');
        console.log('move a player anywhere on the map');
    }

    listen() {
        this.stream.on('input.*', function(event) {
            this.processInputEvent(event);
        }.bind(this));
    }

    processInputEvent(event) {
        // TODO: I think we need to clone the events here

        // Handle special cases for press events
        if(event.identifier.startsWith('input.press')) {
            // On press up events
            if(event.identifier.endsWith('.up')) {
                // Emit input.press events when input.press.up happens
                if(event.identifier == 'input.press.up') {
                    this.activeInputPressDownEvent = null;

                    let clonedEvent = event.clone();
                    clonedEvent.identifier = 'input.press';
                    this.stream.emit(clonedEvent.identifier, clonedEvent);
                }
                // Emit input.press.secondary events when input.press.secondary.up happens
                else if(event.identifier == 'input.press.secondary.up') {
                    this.activeInputPressDownEvent = null;

                    let clonedEvent = event.clone();
                    clonedEvent.identifier = 'input.press.secondary';
                    this.stream.emit(clonedEvent.identifier, clonedEvent);
                }

                // If we are dragging
                if(this.activeInputDragStartEvent) {
                    // Create the input.drag.end event
                    let standardInputDragEndEvent = new StandardInputDragEvent();
                    event.cloneProperties(standardInputDragEndEvent);
                    standardInputDragEndEvent.identifier = 'input.drag.end';

                    // Consume the active drag event
                    this.activeInputDragStartEvent = null;

                    // Emit the input.drag.end event
                    this.stream.emit(standardInputDragEndEvent.identifier, standardInputDragEndEvent);
                }

                // If we are double, triple, or quadruple clicking
                if(this.lastTimeInputPressUpHappened !== null) {
                    // Figure out the last time a press up event happened
                    let timeSinceLastInputPressUp = event.time.differenceInMilliseconds(this.lastTimeInputPressUpHappened);
                    // console.log('timeSinceLastInputPressUp', timeSinceLastInputPressUp);

                    // If we are less than 200 milliseconds, increase the press count and fire an event
                    // Do not allow more than 4 presses in a row
                    if(timeSinceLastInputPressUp < 200 && this.currentInputPressCount < 4) {
                        this.currentInputPressCount++;

                        // Create the input press event
                        let standardInputPressEvent = new StandardInputPressEvent();
                        event.cloneProperties(standardInputPressEvent);
                        standardInputPressEvent.identifier = 'input.press.'+StandardInputPressEvent.pressCountMap[this.currentInputPressCount];

                        // Emit the input press event
                        this.stream.emit(standardInputPressEvent.identifier, standardInputPressEvent);
                    }
                    // If we are greater than 200 milliseconds, reset the press count
                    else {
                        // Reset the press count
                        this.currentInputPressCount = 1;
                    }
                }
                // If this is the first press event
                else {
                    this.currentInputPressCount = 1;
                }

                // Keep track of the last time a press up event happened
                this.lastTimeInputPressUpHappened = event.time;
            }
            // Record last input press down events
            else if(event.identifier.endsWith('.down')) {
                // We are possibly starting a drag
                this.activeInputPressDownEvent = event;
            }
        }
        // Handle special cases for hover events
        else if(event.identifier == 'input.drag') {
            // If we have a press down event and have not received a press up event
            if(this.activeInputPressDownEvent !== null) {
                // Create the input.drag.start event
                let standardInputDragStartEvent = new StandardInputDragEvent();
                this.activeInputPressDownEvent.cloneProperties(standardInputDragStartEvent);
                standardInputDragStartEvent.identifier = 'input.drag.start';

                // Consume the active press down event
                this.activeInputPressDownEvent = null;

                // Create the active input drag start event
                this.activeInputDragStartEvent = standardInputDragStartEvent;

                // Emit the input.drag.start event
                this.stream.emit(standardInputDragStartEvent.identifier, standardInputDragStartEvent);
            }
        }
    }

}

// Export
export { StandardInputEventManager };
