MySql = require('./npm-mysql.js');
MySql.Adapter = {};

MySql.Adapter.reformFields = function(fields) {
	var reformedFields = {};

	fields.each(function(index, column) {
		var databaseField = new DatabaseField();

		databaseField.databaseName = column.db;

		databaseField.tableName = column.table;
		databaseField.originalTableName = column.orgTable;

		databaseField.name = column.name;
		databaseField.originalName = column.orgName;
		
		//databaseField.characterSetId = column.charsetNr;
		//databaseField.length = column.length;
		//databaseField.type = column.type;
		//databaseField.flags = column.flags;
		//databaseField.decimals = column.decimals;

		//databaseField.catalog = column.catalog;
		//databaseField.zeroFill = column.zeroFill;
		//databaseField.protocol41 = column.protocol41;

		reformedFields[column.name] = databaseField;
	});

	return reformedFields;
}

MySql.Adapter.query = function(connection, query, values) {
    return new Promise(function(resolve, reject) {
		var queryResults = connection.query(query, values, function(error, rows, fields) {
			//Console.out(queryResults.sql);

			if(error) {
				resolve(error);
			}
			else {
				var result = {
					sql: queryResults.sql,
					//values: queryResults.values,
					rows: rows,
					fields: MySql.Adapter.reformFields(fields),
				};

				resolve(result);
			}
		});


    });
}