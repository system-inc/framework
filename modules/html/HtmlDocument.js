HtmlDocument = XmlDocument.extend({

	type: 'HTML',
	element: Html.html(),
	head: Html.head(),
	body: Html.body(),

	scripts: [],
	styles: [],

	construct: function() {
	},

	toString: function() {
		var string = '<!DOCTYPE '+this.type+'>';
		
		this.element.append(this.head);
		this.element.append(this.body);

		string += this.element;

		return string;
	},

});