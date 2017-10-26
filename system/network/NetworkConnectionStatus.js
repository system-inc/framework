// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class NetworkConnectionStatus extends EventEmitter {

	// TODO: When Chrome 61 hits electron integrate this https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
	// https://github.com/sindresorhus/public-ip

	localIpAddress = null;
	publicIpAddress = null;

	connected = null;
	connectedToInternet = null;

	type = null; // bluetooth, cellular, ethernet, none, wifi, wimax, other, unknown

	downlinkBandwidthEstimateInMegabitsPerSecond = null;
	maximumDownlinkBandwidthEstimateInMegabitsPerSecond = null;

	uplinkBandwidthEstimateInMegabitsPerSecond = null;
	maximumUplinkBandwidthEstimateInMegabitsPerSecond = null;

	constructor() {
		super();

		this.connected = global.navigator.onLine;

		// When the connection comes online
		global.addEventListener('online', function() {
			//console.log('connected', arguments);
			this.connected = true;
			this.emit('connected', arguments)
		}.bind(this));

		// When the connection goes offline
		global.addEventListener('offline', function() {
			//console.log('disconnected', arguments);
			this.connected = false;
			this.emit('disconnected', arguments)
		}.bind(this));
	}
	
}

// Export
export default NetworkConnectionStatus;
