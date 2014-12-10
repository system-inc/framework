SchemaModel = Class.extend({

	name: null,
	description: null,

	// Schema properties
	properties: {},

	// Indexes
	indexes: [],

	// Relationships
	relationships: {
		hasOne: [],
		hasMany: [],
		belongsTo: [],
		belongsToMany: [],
	},	

	// Methods
	toModel: function() {

	},

});