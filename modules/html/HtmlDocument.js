// Dependencies
var Html = Framework.require('modules/html/Html.js');
var XmlDocument = Framework.require('modules/xml/XmlDocument.js');
var ShortcutManager = Framework.require('modules/web-interface/shortcuts/ShortcutManager.js');

// Class
var HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,
	isMountedToDom: false,
	afterMountedToDom: null,

	view: null,
	head: null,
	body: null,

	titleHtmlElement: null,

	shortcutManager: null,

	shouldScheduleDomUpdates: true,
	//shouldScheduleDomUpdates: false,
	domUpdatesScheduled: false,
	domUpdates: {},

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

	on: function(eventName, callback) {
		// Allow the method to be called statically
		if(this.domDocument) {
			domDocument = this.domDocument;
		}
		else {
			domDocument = document;
		}
		//Console.log('on', eventName, domDocument);

		if(domDocument) {
			// Alias ready to DOMContentLoaded
			if(eventName == 'ready') {
				eventName = 'DOMContentLoaded';
			}

			// If they want to use the custom afterMountedToDom event
			if(eventName == 'afterMountedToDom') {
				if(!this.afterMountedToDom) {
					this.afterMountedToDom = callback;
				}
				else if(Function.is(this.afterMountedToDom)) {
					// Wrap the current function in an array
					this.afterMountedToDom = [this.afterMountedToDom];

					// Add the new callback to the array
					this.afterMountedToDom.append(callback);
				}
				else if(Array.is(this.afterMountedToDom)) {
					this.afterMountedToDom.append(callback);
				}
			}
			// If the document is already ready, just run the function
			else if(eventName == 'DOMContentLoaded' && domDocument.readyState == 'complete') {
				//Console.log('DOM already ready (readyState is complete)', callback);
				callback();
			}
			// If the document isn't ready, add an event listener
			else {
				//Console.log('addEventListener', eventName, callback);
				domDocument.addEventListener(eventName, callback);
			}			
		}
	},

	ready: function(callback) {
		HtmlDocument.on('ready', callback);
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

		if(Function.is(this.afterMountedToDom)) {
			this.afterMountedToDom();
		}
		else if(Array.is(this.afterMountedToDom)) {
			this.afterMountedToDom.each(function(index, callback) {
				callback();
			});
		}

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
			this.domUpdates[htmlNode.identifier] = htmlNode;
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

});

// Static methods

HtmlDocument.on = HtmlDocument.prototype.on;

HtmlDocument.ready = HtmlDocument.prototype.ready;

// Export
module.exports = HtmlDocument;