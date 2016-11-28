// Dependencies
var View = Framework.require('framework/system/interface/graphical/views/View.js');
var Html = Framework.require('framework/system/interface/graphical/web/html/Html.js');

// Class
var TableView = View.extend({

	tag: 'table',

	columns: [],
	rows: [],

	construct: function(settings) {
		super(...arguments);
		this.settings.setDefaults({
		});
	},

	setColumns: function(columns) {
		this.columns = columns;

		var tableHeading = Html.thead();

		var tableHeadingRow = Html.tr();

		this.columns.each(function(columnIndex, column) {
			var tableHeadingRowColumn = Html.th(column);
			tableHeadingRow.append(tableHeadingRowColumn);
		});

		tableHeading.append(tableHeadingRow);

		this.append(tableHeading);

		return this;
	},

	addRow: function() {
		var row = [];
		var tableRow = Html.tr();

		// Loop through the total column count
		for(var i = 0; i < this.columns.length; i++) {
			var currentArgument = arguments[i];
			
			// If not enough arguments were passed to saturate the total column count, use an empty string to fill the rest of the columns
			if(!currentArgument) {
				currentArgument = '';
			}

			row.append(currentArgument);
			var tableColumn = Html.td(currentArgument);
			tableRow.append(tableColumn);
		}

		this.rows.append(row);
		this.append(tableRow);

		return this;
	},

	getData: function() {
		var data = [];

		this.rows.each(function(rowIndex, row) {
			var entry = {};

			this.columns.each(function(columnIndex, column) {
				var useColumnIndexAsColumnName = true;
				var columnName = 'column'+(columnIndex + 1);


				// if the column is a string and is not an empty string
				if(column && String.is(column) && column.trim() != '') {
					useColumnIndexAsColumnName = false;
					columnName = column.toCamelCase();
				}

				var columnValue = row[columnIndex];

				// Disallow non-strings
				if(!String.is(columnValue)) {
					columnValue = null;
				}

				// Don't bloat the data with empty columns
				if(useColumnIndexAsColumnName && !columnValue) {
					// Do nothing
				}
				else {
					entry[columnName] = columnValue;	
				}
			});

			data.append(entry);
		}.bind(this));

		return data;
	},

});

// Export
module.exports = TableView;