XmlDocument = Class.extend({

	declaration: null,
	version: null, // The version of XML
	encoding: null, // The encoding type

	content: [], // An array containing strings or XmlElements

	construct: function() {
	},

	toString: function(indent) {
		var string = '';

		var declaration = '';

		// If there is no declaration
		if(!this.declaration) {
			// If there is a version or encoding, start the declaration
			if(this.version || this.encoding) {
				declaration = '<?xml';
			}

			// If there is a version
			if(this.version) {
				 declaration += ' version="'+this.version+'"';
			}

			// If there is an encoding
			if(this.encoding) {
				 declaration += ' encoding="'+this.encoding+'"';
			}

			// If there is a version or encoding, end the declaration
			if(this.version || this.encoding) {
				declaration += '?>';
			}
		}
		else {
			declaration = this.declaration;
		}

		string += declaration;

		this.content.each(function(index, stringOrElement) {
			string += stringOrElement.toString(indent);
		});

		return string;
	},

});