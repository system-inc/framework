// Dependencies
import { GraphicalInterfaceAdapter } from '@framework/system/interface/graphical/adapters/GraphicalInterfaceAdapter.js';
import { HtmlDocument } from '@framework/system/interface/graphical/web/html/HtmlDocument.js';
import { WebViewAdapter } from '@framework/system/interface/graphical/views/adapters/web/WebViewAdapter.js';
import { Display } from '@framework/system/interface/graphical/Display.js';
import { Event } from '@framework/system/event/Event.js';

// Class
class WebGraphicalInterfaceAdapter extends GraphicalInterfaceAdapter {

	htmlDocument = null;
	broadcastChannel = null;
	broadcastChannelSenderIdentifier = String.uniqueIdentifier();

	async initialize() {
		//console.log('creating HtmlDocument');
		this.htmlDocument = new HtmlDocument();

		// Set the root view
		this.view = this.htmlDocument.body;

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
			var emittedEvent = await this.graphicalInterface.emit('graphicalInterface.unload.before', event, {
				propagationStopped: true, // Do not bubble this event
			});
			return emittedEvent.previousReturnValue;
		}.bind(this));

		// Capture resize events
		this.htmlDocument.on('htmlDocument.resize', function(event) {
			this.graphicalInterface.emit('graphicalInterface.resize', event, {
				propagationStopped: true, // Do not bubble this event
			});
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

	establishBroadcastChannel() {
		var broadcastChannelName = 'graphicalInterface.'+this.graphicalInterface.identifier;

		// Setup a BroadcastChannel for GraphicalInterface events
		this.broadcastChannel = new BroadcastChannel(broadcastChannelName);

		// app.log('Listening to BroadcastChannel', 'graphicalInterface.'+this.graphicalInterface.identifier);
		this.broadcastChannel.onmessage = function(event) {
			// Check if the source of the BroadcastChannel message is the current GraphicalInterface
			if(event.data.senderIdentifier == this.broadcastChannelSenderIdentifier) {
				// console.log('BroadcastChannel message sent by this GraphicalInterface, not emitting again from this.graphicalInterface', event.data.eventIdentifier, event);
			}
			else {
				// console.log('BroadcastChannel message received by other GraphicalInterface, emitting again from this.graphicalInterface', event.data.eventIdentifier, event);
				this.graphicalInterface.emit(
					event.data.eventIdentifier,
					event.data.data,
					{
						propagationStopped: true, // Do not bubble events
					},
					false
				);
			}
		}.bind(this);
	}

	emit(eventIdentifier, data = null, eventOptions = null) {
		// app.log('WebGraphicalInterfaceAdapter .emit()', eventIdentifier, data, eventOptions);

		// If we have data for the event
		if(data !== null) {
			// Do not send Events over the broadcast channel, instead send their data
			if(Event.is(data)) {
				// console.log('Using event data instead of Event', data);
				data = data.data;
			}

			// Catch native untyped events by checking if the sender property is set
			// Do not use an else if here as we may have started out with an Event whose data is
			// still a complex object which cannot be sent over BroadcastChannel
			if(data !== null && data.hasOwnProperty('sender')) {
				// console.log('A sender is set, setting data to null');
				data = null;
			}
		}
		
		console.log('Posting event message to BroadcastChannel for', (this.graphicalInterface.parent === null ? 'self' : 'child'), this.graphicalInterface.identifier, eventIdentifier);

		// Use the broadcast channel to emit events
		this.broadcastChannel.postMessage({
			senderIdentifier: this.broadcastChannelSenderIdentifier,
			graphicalInterfaceIdentifier: this.graphicalInterface.identifier,
			eventIdentifier: eventIdentifier,
			data: data,
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
