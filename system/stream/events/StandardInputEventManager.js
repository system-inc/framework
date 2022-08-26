// Dependencies


// Class
class StandardInputEventManager {

    stream = null;

    constructor(stream) {
        this.stream = stream;

        this.listen();

        console.log('emit input.drag events');
        console.log('emit double click events');
        console.log('draw a box on the screen');
        console.log('test all keys like ! and fix 1 2 3 keys');
    }

    listen() {
        this.stream.on('input.*', function(event) {
            this.processInputEvent(event);
        }.bind(this));
    }

    processInputEvent(event) {
        // TODO: I think we need to clone the events here

        let clonedEvent = event;

        // Emit input.press events when input.press.up happens
        if(event.identifier == 'input.press.up') {
            clonedEvent.identifier = 'input.press';
            this.stream.emit('input.press', clonedEvent);
        }
        else if(event.identifier == 'input.press.secondary.up') {
            clonedEvent.identifier = 'input.press.secondary';
            this.stream.emit('input.press.secondary', clonedEvent);
        }
    }

}

// Export
export { StandardInputEventManager };
