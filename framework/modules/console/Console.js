ConsoleClass = Class.extend({

	construct: function() {
		this.listen();
	},

	log: function() {
		console.log('should log');
		//Log.log.call(this, arguments);
	},

	listen: function() {
		//NodeStandardIn.setRawMode(true); // Takes input character by character
		NodeStandardIn.resume();
		NodeStandardIn.setEncoding('utf8');
		NodeStandardIn.on('data', function(data) {
			this.handleCommand(data);
		}.bind(this));
	},

	handleCommand: function(command) {
		console.log(command);
		if(command.trim() == 'requests') {
			NodeStandardOut.write('Total requests to web server: '+WebServerModule.webServer.requests);
		}
		else {
			NodeStandardOut.write("\n\n\n\n");
		}

		// Always write a line break
		NodeStandardOut.write("\n");
	},

});

// Instantiate a global console
Console = new ConsoleClass();