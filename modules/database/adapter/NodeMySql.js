// https://github.com/felixge/node-mysql
// Expects node-mysql to be globally installed via npm install -g mysql

Node.MySql = require('mysql');

Node.MySql.Adapter = {};

Node.MySql.Adapter.reformColumns = function(columns) {
	var reformedColumns = {};

	columns.each(function(index, column) {
		reformedColumns[column.name] = {
			catalog: column.catalog,
            database: column.db,
            table: column.table,
            originalTable: column.orgTable,
            name: column.name,
            originalName: column.orgName,
            characterSetId: column.charsetNr,
            length: column.length,
            type: column.type,
            flags: column.flags,
            decimals: column.decimals,
            zeroFill: column.zeroFill,
            protocol41: column.protocol41,
		};
	});

	return reformedColumns;
}

Node.MySql.Adapter.query = function(connection, query, values) {
    return new Promise(function(resolve, reject) {
		var queryResults = connection.query(query, values, function(error, rows, columns) {
			//Console.out(queryResults.sql);

			if(error) {
				reject(error);
			}
			else {
				var result = {
					sql: queryResults.sql,
					//values: queryResults.values,
					rows: rows,
					columns: Node.MySql.Adapter.reformColumns(columns),
				};

				resolve(result);
			}
		});


    });
}