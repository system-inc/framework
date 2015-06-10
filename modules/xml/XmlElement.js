XmlElement = Class.extend({

	tag: null,
	unary: false, // Tags are not unary (self-closing) by default
	attributes: {},
	content: [], // Array containing strings or elements

	construct: function(tag, options) {
		this.tag = tag;

		if(options) {
			options.each(function(optionName, optionValue) {
				// Handle content
				if(optionName == 'content') {
					this.append(optionValue);
				}
				else {
					this.setAttribute(optionName, optionValue);
				}
			}.bind(this));
		}
	},

	setAttribute: function(attributeName, attributeValue) {
		this.attributes[attributeName] = attributeValue;

		return this;
	},

	append: function(stringOrElement) {
		this.content.push(stringOrElement);

		return this;
	},

	toString: function() {
		var string = '<'+this.tag;

		// Attributes
		this.attributes.each(function(attributeName, attributeValue) {
			string += ' '+attributeName+'="'+attributeValue+'"';
		});

		if(this.unary) {
			string += ' />';
		}
		else {
			string += '>';

			// Content
			this.content.each(function(index, stringOrElement) {
				string += stringOrElement;
			});

			string += '</'+this.tag+'>';
		}

		return string;
	},

});