// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Log extends EventEmitter {

	constructor() {
		super();

		this.listen();
	}

	listen() {
		this.on('log.*', async function(event) {
			//console.log('log.*', event.data);
			var data = this.processDataToWrite(event.data);
			await this.write(data);
		}.bind(this));
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

	processDataToWrite(passedArguments) {
		var data = '';

		passedArguments.each(function(passedArgumentIndex, passedArgument) {
			data += passedArgument+' ';
		});
		
		data = data.replaceLast(' ', '');

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
