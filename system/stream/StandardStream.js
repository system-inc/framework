// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';

// Class
class StandardStream extends EventEmitter {

	stream = null;

	constructor(stream) {
		if(stream) {
			this.stream = stream;
		}
	}

	write(data) {
		this.stream.write(data);
		this.emit('stream.write', data)
	}

	writeLine(data) {
		var data = data+"\n";
		this.write(data);
	}

}

// Export
export default StandardStream;
