HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,
	onAddedToDom: null,

	element: null,
	head: null,
	body: null,

	title: null,
	scripts: [],
	styles: [],

	//shouldScheduleDomUpdates: true,
	shouldScheduleDomUpdates: false,
	domUpdatesScheduled: false,
	domUpdates: {},

	construct: function(head, body) {
		// An <html> tag to store the head and body
		this.element = Html.html();

		// Establish a reference to the HtmlDocument
		this.element.htmlDocument = this;

		// Conditionally create the head tag
		if(head === undefined) {
			this.head = Html.head();
		}
		else {
			this.head = head;
		}

		// Conditionally create the body tag
		if(body === undefined) {
			this.body = Html.body();	
		}
		else {
			this.body = body;
		}

		// If we the DOM is present, reference the DOM document
		if(global['document']) {
			// Connect this.domDocument to the global document
			this.domDocument = document;
			//console.log('DOM present, HtmlDocument connected to DOM', this);

			// Manually connect the head and body to this HtmlDocument
			this.head.htmlDocument = this;
			this.body.htmlDocument = this;

			// Manually connect this <html> HtmlElement to document.documentElement
			this.element.domElement = this.domDocument.documentElement;

			// Manually connect the head and body domElement's to the domDocument's head and body properties
			this.head.domElement = this.domDocument.head;
			this.body.domElement = this.domDocument.body;
		}

		// Manually append the head and body to the element's content (not using the element's .append() method)
		this.element.content.append(this.head);
		this.element.content.append(this.body);

		// Manually append the <html> tag to the content array
		this.content.append(this.element);
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
		console.log('HtmlDocument.addToDom', this);

		this.buildHead();
		this.head.addToDom();
		this.body.addToDom();

		// At this point the HtmlDocument has been added to the DOM
		this.addedToDom();
	},

	addedToDom: function() {
		//console.log('HtmlDocument added to DOM', this);

		if(Function.is(this.onAddedToDom)) {
			this.onAddedToDom();
		}
		else if(Array.is(this.onAddedToDom)) {
			this.onAddedToDom.each(function(index, callback) {
				callback();
			});
		}
	},

	updateDom: function(htmlElement) {
		console.log('HtmlDocument.updateDom', htmlElement);
		console.log('HtmlDocument.shouldScheduleDomUpdates', this.shouldScheduleDomUpdates);

		// If DOM update scheduling is enabled
		if(this.shouldScheduleDomUpdates) {
			this.scheduleDomUpdate(htmlElement);
		}
		// If not, immediately update the DOM
		else {
			htmlElement.executeDomUpdate();
		}
	},

	scheduleDomUpdate: function(htmlElement) {
		// If an update isn't scheduled already, use the next animation frame to run all updates
		if(!this.domUpdatesScheduled) {
			console.log('scheduling executeDomUpdates');
			this.domUpdatesScheduled = true;

			// Use an object instead of an array so we get the speed of the hash table for deduping updates
			this.domUpdates[htmlElement.identifier] = htmlElement;

			window.requestAnimationFrame(function() {
				this.executeDomUpdates();
			}.bind(this));	
		}
		else {
			console.log('executeDomUpdates already scheduled')
		}
	},

	executeDomUpdates: function() {
		console.log('HtmlDocument.executeDomUpdates', htmlElement);

		// Iterate over all DOM updates
		this.domUpdates.each(function(htmlElementIdentifier, htmlElement) {
			// Run the DOM updates for the HtmlElement
			htmlElement.executeDomUpdates();

			// Remove the HtmlElement from the domUpdates objects
			delete this.domUpdates[htmlElementIdentifier];
		}.bind(this));
	},

	buildHead: function() {
		// Handle title
		if(this.title) {
			this.head.append(Html.title(this.title));
		}

		// Handle scripts
		this.scripts.each(function(index, script) {
			this.head.append(Html.script({
				src: script,
			}));
		}.bind(this));

		// Handle styles
		this.styles.each(function(index, style) {
			this.head.append(Html.link({
				rel: 'stylesheet',
				href: style,
			}));
		}.bind(this));

		return this.head;
	},

	headToString: function(indent) {
		// Use cloning to prevent duplicate appending
		var htmlDocumentClone = this.clone();

		// Build the head element on the clone
		htmlDocumentClone.buildHead();

		return htmlDocumentClone.head.toString(indent);
	},

	headContentToString: function(indent) {
		// Use cloning to prevent duplicate appending
		var htmlDocumentClone = this.clone();

		// Build the head element on the clone
		htmlDocumentClone.buildHead();

		return htmlDocumentClone.head.contentToString(indent);	
	},

	bodyToString: function(indent) {
		return this.body.toString(indent);
	},

	toString: function(indent) {
		// Use cloning to prevent duplicate appending
		var htmlDocument = this.clone();
		//Console.highlight(this.body.toString());

		// Set the declaration
		htmlDocument.declaration = '<!DOCTYPE '+htmlDocument.type+'>';

		// Build the head tag
		htmlDocument.buildHead();

		// Use XmlDocument's toString method (basically calling .super)
		var string = XmlDocument.prototype.toString.apply(htmlDocument, arguments);

		return string;
	},

	clone: function() {
		// Clone the head and body elements to pass into the HtmlDocument constructor
		var head = this.head.clone();
		var body = this.body.clone();

		var htmlDocument = new HtmlDocument(head, body);

		// XML properties
		htmlDocument.type = Object.clone(this.type);
		htmlDocument.declaration = Object.clone(this.declaration);
		htmlDocument.version = Object.clone(this.version);
		htmlDocument.encoding = Object.clone(this.encoding);

		// HTML properties
		htmlDocument.domDocument = this.domDocument;
		htmlDocument.title = Object.clone(this.title);
		htmlDocument.scripts = this.scripts.clone();
		htmlDocument.styles = this.styles.clone();

		return htmlDocument;
	},

});

// Static methods
HtmlDocument.on = HtmlDocument.prototype.on;
HtmlDocument.ready = HtmlDocument.prototype.ready;