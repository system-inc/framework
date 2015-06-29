HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,

	element: null,
	head: null,
	body: null,

	title: null,
	scripts: [],
	styles: [],

	construct: function() {
		// An <html> tag to store the head and body
		this.element = Html.html();

		// Create the head and body tags
		this.head = Html.head();
		this.body = Html.body();

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

			//console.log('addEventListener', eventName);
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

		// Set the declaration
		htmlDocument.declaration = '<!DOCTYPE '+htmlDocument.type+'>';

		// Build the head tag
		htmlDocument.buildHead();

		// Use XmlDocument's toString method (basically calling .super)
		var string = XmlDocument.prototype.toString.apply(htmlDocument, arguments);

		return string;
	},

	clone: function() {
		var htmlDocument = new HtmlDocument();

		// XML properties
		htmlDocument.declaration = this.declaration;
		htmlDocument.version = this.version;
		htmlDocument.encoding = this.encoding;

		// HTML properties
		htmlDocument.title = this.title;
		htmlDocument.scripts = Object.clone(this.scripts);
		htmlDocument.styles = Object.clone(this.styles);
		htmlDocument.element = this.element.clone();

		return htmlDocument;
	},

});

// Static methods
HtmlDocument.on = HtmlDocument.prototype.on;