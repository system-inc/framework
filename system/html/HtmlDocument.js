// Dependencies
var XmlDocument = Framework.require('system/xml/XmlDocument.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var Html = Framework.require('system/html/Html.js');
var ShortcutManager = Framework.require('system/web-interface/shortcuts/ShortcutManager.js');
var HtmlEventsMap = Framework.require('system/html/HtmlEventsMap.js');

// Class
var HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,
	isMountedToDom: false,
	//shouldScheduleDomUpdates: false, // Testing
	shouldScheduleDomUpdates: true,
	domUpdatesScheduled: false,
	domUpdates: {},

	// Views
	view: null,
	head: null,
	body: null,
	titleHtmlElement: null,

	shortcutManager: null,

	construct: function(declaration) {
		// Set the declaration
		if(declaration) {
			this.declaration = declaration;
		}
		else {
			this.declaration = '<!DOCTYPE '+this.type+'>';	
		}

		// An <html> tag to store the head and body
		this.view = Html.html();

		// Establish a reference to the HtmlDocument
		this.view.htmlDocument = this;

		// Create the head and body tags
		this.head = Html.head();
		this.body = Html.body();

		// If we the DOM is present, reference the DOM document
		if(global['document']) {
			// Connect this.domDocument to the global document
			this.domDocument = document;
			//Console.log('DOM present, HtmlDocument connected to DOM', this);

			// Set window.HtmlDocument to this
			//window.htmlDocument = this;

			// Manually connect this <html> HtmlElement to document.documentElement
			this.view.domNode = this.domDocument.documentElement;

			// Manually connect the head and body domNode's to the domDocument's head and body properties
			this.head.domNode = this.domDocument.head;
			this.body.domNode = this.domDocument.body;
		}

		this.view.append(this.head);
		this.view.append(this.body);

		// Manually set the <html> tag to the children array
		this.children = [
			this.view,
		];

		// Keyboard shortcut manager
		this.shortcutManager = new ShortcutManager(this);
	},

	mountToDom: function() {
		// Clear the head and body in preparation for writing the HTML document to the DOM
		// Even though we are removing script references from <head>, any previously included scripts will still have code available (we want this to be the case)
		this.head.emptyDomNode();
		this.body.emptyDomNode();

		//Console.log('HtmlDocument.mountToDom', this);

		// Add this.view to the DOM
		this.view.executeDomUpdate();

		// At this point the HtmlDocument has been added to the DOM
		this.mountedToDom();
	},

	mountedToDom: function() {
		//Console.log('HtmlDocument.mountedToDom', this);

		// The HtmlDocument is now added to the DOM
		this.isMountedToDom = true;

		this.emit('mountedToDom', this);

		//this.printDomUpdates();

		// Now that all of the callbacks have run, execute any pending DOM updates
		this.executeDomUpdates();
	},

	printDomUpdates: function() {
		console.info('**************************************');
		console.info('Pending DOM Updates:')

		if(Object.isEmpty(this.domUpdates)) {
			console.info('No updates.');
		}
		else {
			this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
				console.info(htmlNodeIdentifier, htmlNode.tag, Json.encode(htmlNode.attributes));
			});
		}
		console.info('**************************************');
	},

	updateDom: function(htmlNode) {
		//Console.log('HtmlDocument.updateDom', htmlNode);
		//Console.log('HtmlDocument.shouldScheduleDomUpdates', this.shouldScheduleDomUpdates);

		// Do nothing if the HtmlDocument is not added to the DOM yet
		if(!this.isMountedToDom) {
			//console.info('HtmlDocument.updateDom ignored because HtmlDocument.isMountedToDom is false');
		}
		// If DOM update scheduling is enabled
		else if(this.shouldScheduleDomUpdates) {
			this.scheduleDomUpdate(htmlNode);
		}
		// If not, immediately update the DOM
		else {
			htmlNode.executeDomUpdate();
		}
	},

	scheduleDomUpdate: function(htmlNode) {
		//Console.log('HtmlDocument.scheduleDomUpdate', htmlNode.tag, Json.encode(htmlNode.attributes));

		// Add the HtmlElement to the list of updates to do
		if(htmlNode) {
			// Use an object instead of an array so we get the speed of the hash table for deduping updates
			this.domUpdates[htmlNode.nodeIdentifier] = htmlNode;
		}

		// If an update isn't scheduled already, use the next animation frame to run all updates
		if(!this.domUpdatesScheduled) {
			//Console.log('scheduling executeDomUpdates');
			this.domUpdatesScheduled = true;

			window.requestAnimationFrame(function() {
				//console.info('window.requestAnimationFrame');
				this.executeDomUpdates();
			}.bind(this));
		}
		else {
			//Console.log('executeDomUpdates already scheduled')
		}

		//Console.log('this.domUpdates', this.domUpdates);
	},

	executeDomUpdates: function() {
		//Console.log('HtmlDocument.executeDomUpdates', 'this.domUpdates', this.domUpdates);

		// Iterate over all DOM updates
		this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
			// Run the DOM updates for the HtmlElement
			htmlNode.executeDomUpdate();

			// Remove the HtmlElement from the domUpdates objects
			delete this.domUpdates[htmlNodeIdentifier];
		}.bind(this));

		// Mark all updates as completed
		this.domUpdatesScheduled = false;

		this.emit('domUpdatesExecuted', this);
	},

	setTitle: function(title) {
		// Create the title tag if it doesn't exist
		if(!this.titleHtmlElement) {
			this.titleHtmlElement = Html.title(title);
			this.head.append(this.titleHtmlElement);
		}
		// If it title tag does exist, use domDocument to change it
		else if(this.domDocument) {
			this.domDocument.title = title;
		}
	},

	addScript: function(path) {
		this.head.append(Html.script({
			src: path,
		}));
	},

	addStyleSheet: function(path) {
		this.head.append(Html.link({
			rel: 'stylesheet',
			href: path,
		}));
	},

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		//Console.log('HtmlDocument.addEventListener', eventPattern);

		// Special case for .ready
		if(eventPattern == 'ready') {
			// If the document is already ready, just run the function
			if(this.domDocument && this.domDocument.readyState == 'complete') {
				Console.log('DOM already ready (readyState is complete)', callback);
				functionToBind();
			}
		}
		else {
			// If the event is for the domDocument, add another event listener to the domDocument to proxy the emit when the domDocument emits
			if(HtmlEventsMap[eventPattern]) {
				// If the domDocument already exists
				if(this.domDocument) {
					this.domDocument.addEventListener(HtmlEventsMap[eventPattern], function(event) {
						//Console.log('HtmlDocument with domDocument addEventListener', eventPattern);
						this.emit(eventPattern, event);
					}.bind(this));
				}
				// If we need to wait for the domDocument to be mounted
				else {
					this.on('mountedToDom', function() {
						this.domDocument.addEventListener(HtmlEventsMap[eventPattern], function(event) {
							//Console.log('HtmlDocument waiting for mountedToDom addEventListener', eventPattern);
							this.emit(eventPattern, event);
						}.bind(this));
					}.bind(this));
				}
			}

			// Add the event listener as normal
			return EventEmitter.prototype.addEventListener.apply(this, arguments);
		}
	},

});

// Class implementations
HtmlDocument.implement(EventEmitter);

// Export
module.exports = HtmlDocument;