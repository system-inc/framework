XmlElement = Class.extend({

	tag: null,
	unary: false, // Tags are not unary (self-closing) by default
	attributes: {},
	content: [], // Array containing strings or elements

	construct: function(tag, options, unary) {
		if(tag !== undefined) {
			this.tag = tag;
		}

		// If unary is passed
		if(unary !== undefined) {
			this.unary = unary;
		}

		// Allow options to be strings (or any primitive) which will be used as the default content
		if(options && Primitive.is(options)) {
			this.content.append(options);
		}
		// Allow options to be an object
		else if(options) {
			options.each(function(optionName, optionValue) {
				// Handle content
				if(optionName == 'content') {
					this.append(optionValue);
				}
				// Handle unary being passed as an option
				else if(optionName == 'unary') {
					this.unary = optionValue;
				}
				else {
					this.setAttribute(optionName, optionValue);
				}
			}.bind(this));
		}
	},

	getAttribute: function(attributeName) {
		var attribute = null;

		if(this.attributes[attributeName]) {
			attribute = this.attributes[attributeName];
		}

		return attribute;
	},

	setAttribute: function(attributeName, attributeValue) {
		this.attributes[attributeName] = attributeValue;

		return this;
	},

	removeAttribute: function(attributeName) {
		if(this.attributes[attributeName]) {
			delete this.attributes[attributeName];
		}

		return this;
	},

	empty: function() {
		this.content = [];

		return this;
	},

	prepend: function(stringOrElement) {
		this.content.prepend(stringOrElement);

		return this;
	},	

	append: function(stringOrElement) {
		this.content.append(stringOrElement);

		return this;
	},

	contentToString: function(indent, indentationLevel, indentationCharacter, indentationRepetitions) {
		var string = '';

		this.content.each(function(index, stringOrElement) {
			if(indent) {
				if(Primitive.is(stringOrElement)) {
					string += String.newline+indentationCharacter.repeat(indentationRepetitions * (indentationLevel + 1))+stringOrElement;
				}
				else {
					string += stringOrElement.toString(indent, indentationLevel + 1);	
				}
			}
			else {
				string += stringOrElement.toString();		
			}
		});

		return string;
	},

	toString: function(indent, indentationLevel) {
		var string = '';
		var indentationRepetitions = 4;
		var indentationCharacter = ' ';

		if(indent) {
			if(!indentationLevel) {
				indentationLevel = 0;
			}

			string += String.newline+indentationCharacter.repeat(indentationRepetitions * indentationLevel);
		}

		string += '<'+this.tag;

		// Attributes
		this.attributes.each(function(attributeName, attributeValue) {
			string += ' '+attributeName+'="'+attributeValue+'"';
		});

		if(this.unary) {
			string += ' />';
		}
		else {
			string += '>';

			string += this.contentToString(indent, indentationLevel, indentationCharacter, indentationRepetitions);

			if(this.content.length && indent) {
				string += String.newline+indentationCharacter.repeat(indentationRepetitions * indentationLevel);
			}
			string += '</'+this.tag+'>';	
		}

		return string;
	},

});