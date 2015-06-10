Html = function(tagName, options) {
	return new HtmlElement(tagName, options);
}

Html.html = function(options) {
	return new HtmlElement('html', options);
}

Html.head = function(options) {
	return new HtmlElement('head', options);
}

Html.body = function(options) {
	return new HtmlElement('body', options);
}

// http://xahlee.info/js/html5_non-closing_tag.html
// http://xahlee.info/js/html5_tags.html