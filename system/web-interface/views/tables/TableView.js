// Dependencies
var View = Framework.require('system/web-interface/views/View.js');
var Html = Framework.require('system/html/Html.js');

// Class
var TableView = View.extend({

	tag: 'table',

	attributes: {
		class: 'table',
	},

	columns: [],
	rows: [],

	setColumns: function(columns) {
		this.append('hi!');

		this.columns = columns;

		var tableHeading = Html.thead();

		var tableHeadingRow = Html.tr();

		tableHeadingRow.append(Html.td('Hi'));

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

		arguments.each(function(argumentIndex, argument) {
			row.append(argument);

			var tableColumn = Html.td(argument);

			tableRow.append(tableColumn);
		});

		return this;
	},

});

// Export
module.exports = TableView;