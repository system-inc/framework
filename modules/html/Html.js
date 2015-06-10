Html = function(tag, options) {
	return new XmlElement(tag, options);
}

Html.html = function(options) {
	return new XmlElement('html', options);
}

Html.head = function(options) {
	return new XmlElement('head', options);
}

Html.body = function(options) {
	return new XmlElement('body', options);
}

Html.div = function(options) {
	return new XmlElement('div', options);
}

Html.p = function(options) {
	return new XmlElement('p', options);
}

// http://xahlee.info/js/html5_non-closing_tag.html
// http://xahlee.info/js/html5_tags.html