// Class
class XmlNode {

	content = null;
	parent = null;
	type = 'text'; // text, comment, or element

	constructor(content, parent, type) {
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
	}

	toString() {
		return this.content;
	}

	static is(value) {
		return Class.isInstance(value, XmlNode);
	}

	static makeXmlNode(value, parent, type) {
		// If the value is currently not of type XmlNode, make turn it into an XmlNode
		if(!XmlNode.is(value)) {
			value = new XmlNode(value, parent, type);
		}

		return value;
	}

}

// Export
export default XmlNode;
