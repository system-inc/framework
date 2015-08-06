HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,

	element: null,
	head: null,
	body: null,

	title: null,
	scripts: [],
	styles: [],

	construct: function(head, body) {
		// An <html> tag to store the head and body
		this.element = Html.html();

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

		// Append the head and body to the element
		this.element.append(this.head);
		this.element.append(this.body);

		// Append the <html> tag to the content array
		this.content.append(this.element);

		// If we have a DOM, reference the document and document head and body elements
		if(global['document']) {
			//console.log('document is a global variable', document, document.body);
			this.domDocument = document;

			// Attach domElements to head and body when the document is ready
			this.on('ready', function() {
				this.head.domElement = this.domDocument.head;
				this.body.domElement = this.domDocument.body;
			}.bind(this));
		}
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

			//console.log('addEventListener', eventName, callback);
			domDocument.addEventListener(eventName, callback);
		}
	},

	apply: function() {
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