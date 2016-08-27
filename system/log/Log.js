// Dependencies
import EventEmitter from './../../system/events/EventEmitter.js';

// Class
class Log extends EventEmitter {

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

}

// Export
export default Log;
