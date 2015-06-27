HtmlDocument = XmlDocument.extend({

	type: 'html',

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

		// Append the <html> tag to the content array
		this.content.append(this.element);
	},

	on: function(eventName, callback) {
		// Alias ready to DOMContentLoaded
		if(eventName == 'ready') {
			eventName = 'DOMContentLoaded';
		}

		if(document && document.addEventListener) {
			document.addEventListener(eventName, callback);
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
		var htmlDocument = Object.clone(this);

		htmlDocument.buildHead();

		return htmlDocument.head.toString(indent);
	},

	bodyToString: function(indent) {
		return this.body.toString(indent);
	},

	toString: function(indent) {
		// Use cloning to prevent duplicate appending
		var htmlDocument = Object.clone(this);

		htmlDocument.declaration = '<!DOCTYPE '+this.type+'>';

		// Build the head tag
		htmlDocument.buildHead();

		return htmlDocument.super(indent);
	},

});

// Static methods
HtmlDocument.on = HtmlDocument.prototype.on;