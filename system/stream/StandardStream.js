// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';

// Class
class StandardStream extends EventEmitter {

	nodeStream = null;

	constructor() {
		super();
	}

	write(data) {
		if(this.nodeStream) {
			this.nodeStream.write(data);
		}
	}

	writeLine(data = '') {
		data = data+"\n";
		
		this.write(data);
	}

	setEncoding(encoding) {
		this.nodeStream.setEncoding(encoding);
	}

	setRawMode(enabled) {
		// Raw mode takes input character by character rather than line by line
		this.nodeStream.setRawMode(enabled);
	}

	resume() {
		this.nodeStream.resume();
	}

}

// Export
export default StandardStream;
