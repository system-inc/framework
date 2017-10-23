// Dependencies
import SchemaModel from 'framework/system/data/SchemaModel.js';
import SchemaModelProperty from 'framework/system/data/SchemaModelProperty.js';

// Class
class Schema {

	name = null;
	description = '';
	models = [];
	
	static constructFromDatabaseSchema(databaseSchema) {
		var schema = new Schema();

		schema.name = databaseSchema.name.toCamelcase(true);

		// Loop through tables
		databaseSchema.tables.each(function(tableIndex, table) {
			var schemaModel = new SchemaModel();
			schemaModel.name = table.name.toCamelcase(true);
			schemaModel.description = table.comment;
			
			// Loop through the columns
			table.columns.each(function(columnIndex, column) {
				var schemaModelProperty = new SchemaModelProperty();
				schemaModelProperty.name = column.name.toCamelcase();
				schemaModelProperty.description = column.comment;

				schemaModelProperty.type = SchemaModelProperty.getTypeFromMySqlSchema(column.dataType);
				schemaModelProperty.typeOptions = SchemaModelProperty.getTypeOptionsFromMySqlSchema(column.dataType, column.dataLength, column.autoIncrement, column.unsigned, column.zeroFill);

				schemaModelProperty.default = column.default;
				schemaModelProperty.required = (column.nullable == false);

				// Set key based on naming convention
				if(schemaModelProperty.name == 'id' || schemaModelProperty.name.endsWith('Id')) {
					schemaModelProperty.key = true;
				}
				else {
					schemaModelProperty.key = false;
				}

				schemaModel.properties.append(schemaModelProperty);
			});

			// Loop through the indexes
			table.indexes.each(function(indexIndex, index) {
				var schemaModelIndex = {};
				schemaModelIndex.properties = [];
				index.columns.each(function(indexColumnIndex, indexColumn) {
					schemaModelIndex.properties.append(indexColumn.toCamelcase());
				});
				schemaModelIndex.options = {};
				if(index.unique) {
					schemaModelIndex.options.unique = true;
				}
				schemaModelIndex.description = index.comment;

				schemaModel.indexes.append(schemaModelIndex);
			});

			// Loop through this table's relationships
			table.relationships.each(function(relationshipIndex, relationship) {
				var relationshipToAdd = {};
				relationshipToAdd.type = 'hasOne';
				relationshipToAdd.model = relationship.referencedTableName.toCamelcase(true);
				relationshipToAdd.property = relationship.column.toCamelcase();

				schemaModel.relationships.append(relationshipToAdd);
			});

			// Loop through all relationships
			databaseSchema.tables.each(function(relationshipsLoopTableIndex, relationshipsLoopTable) {
				relationshipsLoopTable.relationships.each(function(relationshipsLoopRelationshipsIndex, relationshipsLoopRelationship) {
					// If the relationship points to this model
					if(relationshipsLoopRelationship.referencedTableName.toCamelcase(true) == schemaModel.name) {
						var relationshipToAdd = {};
						relationshipToAdd.type = 'belongsTo';
						relationshipToAdd.model = relationshipsLoopTable.name.toCamelcase(true);
						relationshipToAdd.property = relationshipsLoopRelationship.column.toCamelcase();

						schemaModel.relationships.append(relationshipToAdd);
					}
				});
			});


			schema.models.append(schemaModel);
		});

		return schema;
	}

}

// Export
export default Schema;
