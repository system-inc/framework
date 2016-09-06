// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';

// Class
class StandardStream extends EventEmitter {

	write(data) {
		this.emit('stream.write', data);
	}

	writeLine(data = '') {
		data = data+"\n";
		
		this.write(data);
	}

}

// Export
export default StandardStream;
