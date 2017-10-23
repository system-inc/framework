// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TableCellView from 'framework/system/interface/graphical/views/tables/TableCellView.js';
import TableHeadingCellView from 'framework/system/interface/graphical/views/tables/TableHeadingCellView.js';
import TableHeadingView from 'framework/system/interface/graphical/views/tables/TableHeadingView.js';
import TableRowView from 'framework/system/interface/graphical/views/tables/TableRowView.js';

// Class
class TableView extends View {

	columns = [];
	rows = [];

	setColumns(columns) {
		this.columns = columns;

		var tableHeading = new TableHeadingView();

		var tableHeadingRow = new TableRowView();

		this.columns.each(function(columnIndex, column) {
			var tableHeadingRowColumn = new TableHeadingCellView(column);
			tableHeadingRow.append(tableHeadingRowColumn);
		});

		tableHeading.append(tableHeadingRow);

		this.append(tableHeading);

		return this;
	}

	addRow() {
		var row = [];
		var tableRowView = new TableRowView();

		// Loop through the total column count
		for(var i = 0; i < this.columns.length; i++) {
			var currentArgument = arguments[i];
			
			// If not enough arguments were passed to saturate the total column count, use an empty string to fill the rest of the columns
			if(!currentArgument) {
				currentArgument = '';
			}

			row.append(currentArgument);
			var tableColumnCellView = new TableCellView(currentArgument);
			tableRowView.append(tableColumnCellView);
		}

		this.rows.append(row);
		this.append(tableRowView);

		return tableRowView;
	}

	getData() {
		var data = [];

		this.rows.each(function(rowIndex, row) {
			var entry = {};

			this.columns.each(function(columnIndex, column) {
				var useColumnIndexAsColumnName = true;
				var columnName = 'column'+(columnIndex + 1);


				// if the column is a string and is not an empty string
				if(column && String.is(column) && column.trim() != '') {
					useColumnIndexAsColumnName = false;
					columnName = column.toCamelcase();
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
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'table',
		};
	}

}

// Export
export default TableView;
