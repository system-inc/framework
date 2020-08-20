// Class
class XmlNode {

	content = null;
	parent = null;
	type = 'text'; // text, comment, or element

	nodeIdentifier = null // Used to uniquely identify nodes for tree comparisons
	nodeIdentifierCounter = 0; // Used to ensure unique identifiers

	constructor(content = null, parent = null, type = null) {
		// Set the content
		if(content !== null) {
			this.content = content;
		}

		// Set the parent
		if(parent !== null) {
			this.setParent(parent);
		}

		// Set the type
		if(type !== null) {
			this.type = type;
		}
	}

	setParent(parent) {
		this.parent = parent;

		// Reset the nodeIdentifierCounter
		this.nodeIdentifierCounter = 0;

		// If the parent does not have an identifier, give it the root identifier of '0'
		if(this.parent.nodeIdentifier === null) {
			this.parent.nodeIdentifier = '0';
		}

		// Set the identifier
		this.nodeIdentifier = this.parent.nodeIdentifier+'.'+this.parent.nodeIdentifierCounter;
		this.parent.nodeIdentifierCounter++;
	}

	orphan() {
		this.parent = null;
		this.nodeIdentifier = null;
		this.nodeIdentifierCounter = 0;
	}

	toString() {
		return this.content;
	}

	static makeXmlNode(value, parent, type) {
		if(value === null || value === undefined) {
			throw new Error('XmlNodes may not be created from from null or undefined values.');
		}

		// If the value is currently not of type XmlNode, turn it into an XmlNode
		if(!XmlNode.is(value)) {
			value = new XmlNode(value, parent, type);
		}

		return value;
	}

	static is(value) {
		return Class.isInstance(value, XmlNode);
	}

}

// Export
export default XmlNode;
