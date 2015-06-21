HtmlDocument = XmlDocument.extend({

	type: 'html',

	element: null,
	head: null,
	body: null,

	scripts: [],
	styles: [],

	construct: function() {
		// An <html> tag to store the head and body
		this.element = Html.html();

		// Create the head and body tags
		this.head = Html.head();
		this.body = Html.body();

		// Append the head and body to the <html> tag
		this.element.append(this.head);
		this.element.append(this.body);

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
		// Will probably have to rewrite this in the future, works for now
		if(document && document.open) {
			var openDocument = document.open('text/html');
			openDocument.write(this.toString());
			openDocument.close();
		}
	},

	toString: function(indent) {
		this.declaration = '<!DOCTYPE '+this.type+'>';

		return this.super(indent);
	},

});

// Static methods
HtmlDocument.on = HtmlDocument.prototype.on;