XmlNode = Class.extend({

	content: null,
	parent: null,
	type: 'text', // text, comment, or element

	construct: function(content, parent, type) {
		// Value
		if(content !== undefined) {
			this.content = content;
		}

		// Parent
		if(parent !== undefined) {
			this.parent = parent;
		}

		// Type
		if(type !== undefined) {
			this.type = type;
		}
	},

	toString: function() {
		return this.content;
	},

});

// Static methods
XmlNode.is = function(value) {
	return Class.isInstance(value, XmlNode);
}

XmlNode.makeXmlNode = function(value, parent, type) {
	// If the value is currently not of type XmlNode, make turn it into an XmlNode
	if(!XmlNode.is(value)) {
		value = new XmlNode(value, parent, type);
	}

	return value;
}