// Dependencies
import { GraphicalInterfaceAdapter } from '@framework/system/interface/graphical/adapters/GraphicalInterfaceAdapter.js';
import { HtmlDocument } from '@framework/system/interface/graphical/web/html/HtmlDocument.js';
import { WebViewAdapter } from '@framework/system/interface/graphical/views/adapters/web/WebViewAdapter.js';
import { Display } from '@framework/system/interface/graphical/Display.js';

// Class
class WebGraphicalInterfaceAdapter extends GraphicalInterfaceAdapter {

	htmlDocument = null;
	broadcastChannel = null;

	async initialize() {
		//console.log('creating HtmlDocument');
		this.htmlDocument = new HtmlDocument();

		// Set the root view
		this.view = this.htmlDocument.body;

		// Establish a BroadcastChannel which will allow us to send events to other graphical interfaces
		this.establishBroadcastChannel();

		// Hook the HtmlDocument's emit function to re-emit events on the GraphicalInterface
		var standardHtmlDocumentEmit = this.htmlDocument.emit;
		this.htmlDocument.emit = async function(eventIdentifier, data, eventOptions) {
			//console.log('candidate for GraphicalInterface emit', ...arguments);

			var matching = this.htmlDocument.getEventListeners(eventIdentifier);
			//console.info('matching', matching);

			// Filter out what GraphicalInterface will emit
			if(
				matching.length && // Only emit events on the GraphicalInterface which have direct matches
				!eventIdentifier.startsWith('htmlDocument.') &&
				!eventIdentifier.startsWith('input.') &&
				!eventIdentifier.startsWith('form.')
			) {
				console.info('This event is being written to local storage - eventIdentifier', eventIdentifier);
				// We also emit the event on the graphical interface
				await this.graphicalInterface.emit.apply(this.graphicalInterface, arguments);
			}

			// Emit the event on the HtmlDocument as normal
			return await standardHtmlDocumentEmit.apply(this.htmlDocument, arguments);
		}.bind(this);

		//console.log('Mounting HtmlDocument to DOM');
		this.htmlDocument.initialize();

		// Capture before unload
		this.htmlDocument.on('htmlDocument.unload.before', async function(event) {
			var emittedEvent = await this.graphicalInterface.emit('graphicalInterface.unload.before', event);
			return emittedEvent.previousReturnValue;
		}.bind(this));

		// Capture resize events
		this.htmlDocument.on('htmlDocument.resize', function(event) {
			this.graphicalInterface.emit('graphicalInterface.resize', event);
			this.graphicalInterface.dimensions = this.htmlDocument.dimensions;
		}.bind(this));

		// Set the dimensions
		this.graphicalInterface.dimensions = this.htmlDocument.dimensions;
		//console.info('this.htmlDocument.dimensions', this.htmlDocument.dimensions);

		// Set the URL
		this.graphicalInterface.url = this.htmlDocument.url;

		// Not initialized until the DOM is ready
		return new Promise(function(resolve, reject) {
			// Emit the ready event when the DOM is ready
			// console.log('this.htmlDocument.domDocument', this.htmlDocument.domDocument.readyState);
			if(this.htmlDocument.domDocument.readyState == 'complete') {
				resolve(this);
			}
			// If the DOM is not ready, wait for it to be ready
			else {
				this.htmlDocument.domDocument.addEventListener('DOMContentLoaded', function(event) {
					resolve(this);
				}.bind(this));
			}
		}.bind(this));
	}

	createViewAdapter(view) {
		return new WebViewAdapter(view);
	}

	initializeDisplays() {
		console.log('WebGraphicalInterfaceAdapter initializeDisplays');

		var display = new Display();
		display.dimensions.width = window.screen.width;
		display.dimensions.height = window.screen.width;

		this.graphicalInterface.display = display;
		this.graphicalInterface.displays = {
			1: display,
		};
	}

	addScript() {
		this.htmlDocument.addScript(...arguments);
	}

	addStyleSheet() {
		this.htmlDocument.addStyleSheet(...arguments);
	}

	establishBroadcastChannel(emitEventsFromGraphicalInterface = false) {
		// Setup a BroadcastChannel for GraphicalInterface events
		this.broadcastChannel = new BroadcastChannel('graphicalInterface.'+this.graphicalInterface.identifier);

		if(emitEventsFromGraphicalInterface) {
			// app.log('Listening to BroadcastChannel', 'graphicalInterface.'+this.graphicalInterface.identifier);
			this.broadcastChannel.onmessage = function(event) {
				// console.log('BroadcastChannel event', event);
				this.graphicalInterface.emit(
					event.data.eventIdentifier,
					event.data.data,
					{
						propagationStopped: true, // Do not bubble events
					},
					false
				);
			}.bind(this);
		}
	}

	emit(eventIdentifier, data, eventOptions) {
		// app.log('WebGraphicalInterfaceAdapter .emit()', eventIdentifier, data, eventOptions);

		// Use the broadcast channel to emit events
		this.broadcastChannel.postMessage({
			graphicalInterfaceIdentifier: this.graphicalInterface.identifier,
			eventIdentifier: eventIdentifier,
			data: null,
			// data: data, // TODO: Passing complex data objects over BroadcastChannel is not supported
			eventOptions: eventOptions,
		});
	}

	addEventListener(eventPattern, functionToBind, timesToRun) {
		// Filter out events which don't need to be added to the HtmlDocument
		if(
			eventPattern !== '*' && // Don't allow the listening to all events as these will be written to local storage
			!eventPattern.startsWith('graphicalInterface.') && // Don't bind graphical interface events to the document
			!eventPattern.startsWith('display.') // Don't bind display events to the document
		) {
			// Only listen to events if there is an HtmlDocument to listen to events
			// The first graphical interface will have an HtmlDocument, any other graphical interfaces will not
			if(this.htmlDocument) {
				this.htmlDocument.addEventListener(...arguments);
			}
		}

		return this;
	}

	getSelection() {
		return this.htmlDocument.getSelection(...arguments);
	}

	insertText() {
		return this.htmlDocument.insertText(...arguments);
	}

	print() {
		return this.htmlDocument.domWindow.print();
	}

}

// Export
export { WebGraphicalInterfaceAdapter };
