// Dependencies
import { Server } from '@framework/system/server/Server.js';
import { Settings } from '@framework/system/settings/Settings.js';
import { FileLog } from '@framework/system/log/FileLog.js';
import { Router } from '@framework/system/web/server/routes/Router.js';
import { Request } from '@framework/system/web/server/Request.js';
import { Response } from '@framework/system/web/server/Response.js';
import { InternalServerError } from '@framework/system/web/server/errors/InternalServerError.js';
import { File } from '@framework/system/file-system/File.js';

// Class
class WebServer extends Server {

	identifier = null;
	directory = null;
	requests = 0;

	settings = new Settings({
		directory: null,
		verbose: true,
		logs: {
			general: {
				enabled: true,
				directory: null, // Will set this default in constructor
				nameWithoutExtension: null, // Will set this default in constructor
			},
			requests: {
				enabled: true,
				directory: null, // Will set this default in constructor
				nameWithoutExtension: null, // Will set this default in constructor
			},
			responses: {
				enabled: true,
				directory: null, // Will set this default in constructor
				nameWithoutExtension: null, // Will set this default in constructor
			},
		},
		protocols: {
			http: {
				ports: [],
			},
			https: {
				keyFile: null,
				certificateFile: null,
			},
		},
		serverTimeoutInMilliseconds: 60000, // 60 seconds
		requestTimeoutInMilliseconds: 20000, // 20 seconds
		responseTimeoutInMilliseconds: 20000, // 20 seconds
		maximumRequestBodySizeInBytes: 20000000, // 20 megabytes
	});
	
	router = null;
	listeners = {};
	logs = {
		general: null,
		requests: null,
		responses: null,
	};

	constructor(identifier, settings) {
		super();

		this.identifier = identifier;

		// Set the defaults that depend on logic
		this.settings.mergeDefaults({
			logs: {
				general: {
					directory: Node.Path.join(app.directory, 'logs'),
					nameWithoutExtension: 'web-server-'+this.identifier.toDashes(),
				},
				requests: {
					directory: Node.Path.join(app.directory, 'logs'),
					nameWithoutExtension: 'web-server-'+this.identifier.toDashes()+'-requests',
				},
				responses: {
					directory: Node.Path.join(app.directory, 'logs'),
					nameWithoutExtension: 'web-server-'+this.identifier.toDashes()+'-responses',
				},
			},
		});

		// Merge in the provided settings
		this.settings.merge(settings);
		//app.log('settings', settings);
		//app.log('this.settings', this.settings);

		// Set the web server directory
		var settingsDirectory = this.settings.get('directory');
		if(settingsDirectory) {
			this.directory = Node.Path.normalize(settingsDirectory);
		}
		else {
			this.directory = app.directory;
		}
		// Update the settings with this.directory
		this.settings.set('directory', this.directory);

		// Conditionally attach the general log
		if(this.settings.get('logs.general.enabled')) {
			this.logs.general = new FileLog(this.settings.get('logs.general.directory'), this.settings.get('logs.general.nameWithoutExtension'));
		}

		// Conditionally attach the requests log
		if(this.settings.get('logs.requests.enabled')) {
			this.logs.requests = new FileLog(this.settings.get('logs.requests.directory'), this.settings.get('logs.requests.nameWithoutExtension'));
		}

		// Conditionally attach the responses log
		if(this.settings.get('logs.responses.enabled')) {
			this.logs.responses = new FileLog(this.settings.get('logs.responses.directory'), this.settings.get('logs.responses.nameWithoutExtension'));
		}

		// Allow HTTPS files to be configured in settings just using a file name
		this.resolveHttpsProtocolFiles();

		// Load the routes into the router
		this.router = new Router();
		//app.info('this.router', this.router); app.exit();
	}

	async initialize() {
		await this.router.loadRoutes(this.settings.get('router.routes'));
	}

	resolveHttpsProtocolFiles() {
		// Make key and certificate file paths in settings absolute if they are initially provided as relative file paths

		var httpsSettings = this.settings.get('protocols.https');

		// Key file
		if(!Object.isEmpty(httpsSettings.keyFile)) {
			httpsSettings.keyFile = Node.Path.normalize(httpsSettings.keyFile);
			if(!Node.Path.isAbsolute(httpsSettings.keyFile)) {
				httpsSettings.keyFile = Node.Path.join(app.directory, 'settings', 'environment', 'modules', 'web-server', 'https', httpsSettings.keyFile);
			}
		}

		// Certificate file
		if(!Object.isEmpty(httpsSettings.certificateFile)) {
			httpsSettings.certificateFile = Node.Path.normalize(httpsSettings.certificateFile);
			if(!Node.Path.isAbsolute(httpsSettings.certificateFile)) {
				httpsSettings.certificateFile = Node.Path.join(app.directory, 'settings', 'environment', 'modules', 'web-server', 'https', httpsSettings.certificateFile);
			}
		}

		this.settings.set('protocols.https', httpsSettings);
	}

	async start() {
		var protocols = this.settings.get('protocols');
		//app.log('protocols', protocols);

		// Loop through the protocols (http/https)
		await protocols.each(async function(protocol, protocolSettings) {
			// Create a listener for each port they want to listen on
			if(protocolSettings.ports) {
				await protocolSettings.ports.toArray().each(async function(portIndex, port) {
					// If we are already listening on that port
					if(this.listeners[port]) {
						app.error('Could not create a web server listener on port '+port+', a listener is already using the port.');
					}
					// If the port is free
					else {
						var nodeServer;

						// HTTPS
						if(protocol == 'https') {
							// Make sure they have a keyFile and a certificateFile
							if(Object.isEmpty(protocolSettings.keyFile)) {
								app.error('Could not create a secure web server (HTTPS) listener on port '+port+', the key file is not set.');
								return;
							}
							if(Object.isEmpty(protocolSettings.certificateFile)) {
								app.error('Could not create a secure web server (HTTPS) listener on port '+port+', the certicate file is not set.');
								return;
							}
							if(!(await File.exists(protocolSettings.keyFile))) {
								app.error('Could not create a secure web server (HTTPS) listener on port '+port+', the key file "'+protocolSettings.keyFile+'" does not exist.');
								return;
							}
							if(!(await File.exists(protocolSettings.certificateFile))) {
								app.error('Could not create a secure web server (HTTPS) listener on port '+port+', the certificate file "'+protocolSettings.certificateFile+'" does not exist.');
								return;
							}

							var key = await (await File.read(protocolSettings.keyFile)).toString();
							var cert = await (await File.read(protocolSettings.certificateFile)).toString();

							var httpsServerSettings = {
								key: key,
								cert: cert,
							};
							//app.log(httpsServerSettings);

							nodeServer = Node.Https.createServer(httpsServerSettings, this.handleRequestConnection.bind(this));
						}
						// HTTP
						else if(protocol == 'http') {
							nodeServer = Node.Http.createServer(this.handleRequestConnection.bind(this));
						}

						// Set a timeout on server connections
						nodeServer.setTimeout(this.settings.get('serverTimeoutInMilliseconds'));

						// Create the web server
						this.listeners[port] = nodeServer;

						// Make the web server listen on the port, wait on this until either an error or the "listening" event is emitted
						await new Promise(function(resolve, reject) {
							// Listen for errors
							this.listeners[port].on('error', function(error) {
								// Keep going if the address is in use
								if(error.code == 'EADDRINUSE') {
									app.error('Could not listen to '+protocol.uppercase()+' requests on port '+port+', the port is already in use.');
									resolve(true);
								}
								// Keep going if the user account does not have access
								else if(error.code == 'EACCES') {
									app.error('Could not listen to '+protocol.uppercase()+' requests on port '+port+', your system user account does not have permission to use port '+port+'.');
									resolve(true);
								}
								// Throw an error in all other cases
								else {
									reject(error);
								}
							});

							// Listen for the listening event
							this.listeners[port].on('listening', function() {
								if(this.settings.get('verbose')) {
									app.log('Listening for '+protocol.uppercase()+' requests on port '+port+'.');
								}
								resolve(true);
							}.bind(this));

							// Listen
							this.listeners[port].listen(port.toString()); // Ports must be strings
						}.bind(this));
					}
				}.bind(this));
			}
		}.bind(this));
	}

	async stop() {
		if(this.settings.get('verbose')) {
			app.warn('Stopping '+this.identifier+' web server...');
		}

		await this.listeners.each(async function(port, nodeServer) {
			await new Promise(function(resolve, reject) {
				nodeServer.close(function() {
					if(this.settings.get('verbose')) {
						app.warn('No longer listening for HTTP requests on port '+port+'.');
					}
					resolve(true);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	}

	async handleRequestConnection(nodeRequest, nodeResponse) {
		// Increment the requests counter right away in case of crashes
		this.requests++;

		// Create the request object which wrap node's request object
		try {
			var request = new Request(nodeRequest, this);
			await request.initialize();
		}
		catch(error) {
			this.handleInternalServerError(error, nodeResponse);
			return;
		}

		// Create the response object which wrap node's response object
		try {
			var response = new Response(nodeResponse, request, this);
		}
		catch(error) {
			this.handleInternalServerError(error, nodeResponse, request);
			return;
		}

		// Set a timeout on handling the request
		nodeRequest.setTimeout(this.settings.get('requestTimeoutInMilliseconds'), function(socket) {
			this.handleError(request, response, new InternalServerError('Timed out after '+this.settings.get('requestTimeoutInMilliseconds')+' milliseconds while receiving the request.'));
		}.bind(this));

		// Set a timeout on building the response
		nodeResponse.setTimeout(this.settings.get('responseTimeoutInMilliseconds'), function(socket) {
			this.handleError(request, response, new InternalServerError('Timed out after '+this.settings.get('responseTimeoutInMilliseconds')+' milliseconds while building a response.'));
		}.bind(this));

		// Handle the request
		this.handleRequest(request, response);
	}

	async handleRequest(request, response) {
		// Process the request
		try {
			// Mark the request as received
			request.received();

			// Wait for the node request to finish
			var nodeRequest = await Request.receiveNodeRequest(request, this.settings.get('maximumRequestBodySizeInBytes'));

			// Use this to troubleshoot race conditions
			//var randomMilliseconds = Number.random(1, 100);
			//app.log('Waiting '+randomMilliseconds+' milliseconds...');
			//await Function.delay(randomMilliseconds);

			// Identify and follow the route
			await this.router.route(request, response);
		}
		catch(error) {
			this.handleError(request, response, error);
		}
	}

	// Handles errors that occur after nodeResponse is wrapped in a Framework response object
	handleError(request, response, error) {
		var logEntry = app.formatLogData('WebServer.handleError() called on request '+request.id+'. '+"\n\n"+error.name+': '+error.message+"\n"+error.stack.toString()+"\n"+'Request:', request.getPublicErrorData());
		if(this.settings.get('verbose')) {
			app.error(logEntry);
		}

		// Mark the response as handled
		response.handled = true;

		// Set the status code
		if(!error.code || !Number.is(error.code)) {
			response.statusCode = 500;
		}
		else {
			response.statusCode = error.code;
		}
		//app.info('response.statusCode', response.statusCode);

		// Set the content
		response.content = Json.encode({
			errors: [Error.toPublicObject(error)],
			request: request.getPublicErrorData(),
		});

		// Conditionally log the failed request to the general log
		if(this.logs.general) {
			this.logs.general.write(logEntry+"\n");
		}

		// Forcefully send the response
		response.send(true);
	}

	// Handles errors that occur before nodeResponse is wrapped in a Framework response object
	handleInternalServerError(error, nodeResponse, request) {
		var requestId = '<unknown request ID>';
		var requestPublicErrorData = '<unknown request public error data>';
		if(request && request.id) {
			requestId = request.id;
			requestPublicErrorData = request.getPublicErrorData();
		}

		var logEntry = app.formatLogData('WebServer.handleError() called on request '+requestId+'. '+"\n\n"+error.name+': '+error.message+"\n"+error.stack.toString()+"\n"+'Request:', requestPublicErrorData);
		if(this.settings.get('verbose')) {
			app.error(logEntry);
		}
		
		nodeResponse.writeHead(500, [['Content-Type', 'application/json']]);

		// Make sure we are working with an error object
		if(error.code != 500) {
			error = new InternalServerError();
		}

		// The content to return in the request
		var content = {
			errors: [Error.toPublicObject(error)],
		};

		// Add request data to the content if we have it
		if(request) {
			content.request = request.getPublicErrorData();
		}

		// Encode the content
		content = Json.encode(content);

		// Conditionally log the failed request to the general log
		if(this.logs.general) {
			this.logs.general.write(logEntry+"\n");
		}

		// Send the content and end the response
		nodeResponse.end(content);
	}

}

// Export
export { WebServer };
