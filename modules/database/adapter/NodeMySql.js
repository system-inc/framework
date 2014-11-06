// https://github.com/felixge/node-mysql
// Expects node-mysql to be globally installed via npm install -g mysql

Node.MySql = require('mysql');

Node.MySql.Adapter = {};

Node.MySql.Adapter.reformFields = function(fields) {
	var reformedFields = {};

	fields.each(function(index, field) {
		reformedFields[field.name] = {
			catalog: field.catalog,
            database: field.db,
            table: field.table,
            originalTable: field.orgTable,
            name: field.name,
            originalName: field.orgName,
            characterSetId: field.charsetNr,
            length: field.length,
            type: field.type,
            flags: field.flags,
            decimals: field.decimals,
            zeroFill: field.zeroFill,
            protocol41: field.protocol41,
		};
	});

	return reformedFields;
}

Node.MySql.Adapter.query = Promise.method(function(connection, query, values) {
    return new Promise(function(resolve, reject) {
		connection.query(query, values, function(error, rows, fields) {
			if(error) {
				reject(error);
			}
			else {
				//var result = {
				//	rows: rows,
				//	fields: Node.MySql.Adapter.reformFields(fields),
				//};

				resolve(rows);
			}
		});
    });
});