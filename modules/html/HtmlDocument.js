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

	toString: function(indent) {
		this.declaration = '<!DOCTYPE '+this.type+'>';

		return this.super(indent);
	},

});