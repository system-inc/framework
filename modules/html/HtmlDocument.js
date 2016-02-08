HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,
	onAddedToDom: null,
	isAddedToDom: false,

	element: null,
	head: null,
	body: null,

	titleHtmlElement: null,

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
		this.element = Html.html();

		// Establish a reference to the HtmlDocument
		this.element.htmlDocument = this;

		// Create the head and body tags
		this.head = Html.head();
		this.body = Html.body();

		// If we the DOM is present, reference the DOM document
		if(global['document']) {
			// Connect this.domDocument to the global document
			this.domDocument = document;
			//console.log('DOM present, HtmlDocument connected to DOM', this);

			// Manually connect this <html> HtmlElement to document.documentElement
			this.element.domElement = this.domDocument.documentElement;

			// Manually connect the head and body domElement's to the domDocument's head and body properties
			this.head.domElement = this.domDocument.head;
			this.body.domElement = this.domDocument.body;
		}

		this.element.append(this.head);
		this.element.append(this.body);

		// Manually set the <html> tag to the content array
		this.content = [
			this.element,
		];
	},

	on: function(eventName, callback) {
		// Allow the method to be called statically
		if(this.domDocument) {
			domDocument = this.domDocument;
		}
		else {
			domDocument = document;
		}
		//console.log('on', eventName, domDocument);

		if(domDocument) {
			// Alias ready to DOMContentLoaded
			if(eventName == 'ready') {
				eventName = 'DOMContentLoaded';
			}

			// If they want to use the custom onAddedToDom event
			if(eventName == 'addedToDom') {
				if(!this.onAddedToDom) {
					this.onAddedToDom = callback;
				}
				else if(Function.is(this.onAddedToDom)) {
					// Wrap the current function in an array
					this.onAddedToDom = [this.onAddedToDom];

					// Add the new callback to the array
					this.onAddedToDom.append(callback);
				}
				else if(Array.is(this.onAddedToDom)) {
					this.onAddedToDom.append(callback);
				}
			}
			// If the document is already ready, just run the function
			else if(eventName == 'DOMContentLoaded' && domDocument.readyState == 'complete') {
				//console.log('DOM already ready (readyState is complete)', callback);
				callback();
			}
			// If the document isn't ready, add an event listener
			else {
				//console.log('addEventListener', eventName, callback);
				domDocument.addEventListener(eventName, callback);
			}			
		}
	},

	ready: function(callback) {
		HtmlDocument.on('ready', callback);
	},

	addToDom: function() {
		//console.log('HtmlDocument.addToDom', this);

		// Add this.element to the DOM
		this.element.addToDom();

		// At this point the HtmlDocument has been added to the DOM
		this.addedToDom();
	},

	addedToDom: function() {
		//console.log('HtmlDocument.addedToDom', this);

		// The HtmlDocument is now added to the DOM
		this.isAddedToDom = true;

		if(Function.is(this.onAddedToDom)) {
			this.onAddedToDom();
		}
		else if(Array.is(this.onAddedToDom)) {
			this.onAddedToDom.each(function(index, callback) {
				callback();
			});
		}

		//this.printDomUpdates();

		// Now that all of the callbacks have run, execute any pending DOM updates
		this.executeDomUpdates();
	},

	printDomUpdates: function() {
		console.info('**************************************')
		console.info('Pending DOM Updates:')

		if(Object.isEmpty(this.domUpdates)) {
			console.info('No updates.');
		}
		else {
			this.domUpdates.each(function(htmlElementIdentifier, htmlElement) {
				console.info(htmlElementIdentifier, htmlElement.tag, Json.encode(htmlElement.attributes));
			});
		}
		console.info('**************************************')
	},

	updateDom: function(htmlElement) {
		//console.log('HtmlDocument.updateDom', htmlElement);
		//console.log('HtmlDocument.shouldScheduleDomUpdates', this.shouldScheduleDomUpdates);

		// Do nothing if the HtmlDocument is not added to the DOM yet
		if(!this.isAddedToDom) {
			//console.info('HtmlDocument.updateDom ignored because HtmlDocument.isAddedToDom is false');
		}
		// If DOM update scheduling is enabled
		else if(this.shouldScheduleDomUpdates) {
			this.scheduleDomUpdate(htmlElement);
		}
		// If not, immediately update the DOM
		else {
			htmlElement.executeDomUpdate();
		}
	},

	scheduleDomUpdate: function(htmlElement) {
		//console.log('HtmlDocument.scheduleDomUpdate', htmlElement.tag, Json.encode(htmlElement.attributes));

		// Add the HtmlElement to the list of updates to do
		if(htmlElement) {
			// Use an object instead of an array so we get the speed of the hash table for deduping updates
			this.domUpdates[htmlElement.identifier] = htmlElement;
		}

		// If an update isn't scheduled already, use the next animation frame to run all updates
		if(!this.domUpdatesScheduled) {
			//console.log('scheduling executeDomUpdates');
			this.domUpdatesScheduled = true;

			window.requestAnimationFrame(function() {
				//console.info('window.requestAnimationFrame');
				this.executeDomUpdates();
			}.bind(this));	
		}
		else {
			//console.log('executeDomUpdates already scheduled')
		}

		//console.log('this.domUpdates', this.domUpdates);
	},

	executeDomUpdates: function() {
		//console.log('HtmlDocument.executeDomUpdates', 'this.domUpdates', this.domUpdates);

		// Iterate over all DOM updates
		this.domUpdates.each(function(htmlElementIdentifier, htmlElement) {
			// Run the DOM updates for the HtmlElement
			htmlElement.executeDomUpdate();

			// Remove the HtmlElement from the domUpdates objects
			delete this.domUpdates[htmlElementIdentifier];
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