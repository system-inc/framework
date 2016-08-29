// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';

// Class
class Log extends EventEmitter {

	constructor() {
		super();

		this.listen();
	}

	listen() {
		this.on('log.*', function(data) {
			data = this.processDataToWrite(data);
			this.write(data);
		});
	}

	log() {
		this.emit('log.log', arguments);
	}

	info() {
		this.emit('log.info', arguments);
	}

	warn() {
		this.emit('log.warn', arguments);
	}

	error() {
		this.emit('log.error', arguments);
	}

	processDataToWrite(data) {
		return data;
	}

	async write(string) {
		console.log(string);
	}	

	async writeLine(string) {
		return await this.write(string+"\n");
	}

}

// Export
export default Log;
