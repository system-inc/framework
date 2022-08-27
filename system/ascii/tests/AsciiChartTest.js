// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { AsciiChart } from '@framework/system/ascii/AsciiChart.js';

// Class
class AsciiChartTest extends Test {

	async test() {
		return;

		// Simple chart
		let points = [
			[1,1],
			[2,1],
			[3,1],
			[4,5],
			[5,1.5],
		];
		
		let asciiChart = new AsciiChart(points, {
			// color: 'ascii',
			title: 'AsciiChart Test',
			titleAlignment: 'center',
			gridColor: 'gray',
			width: 80,
			height: 20,
			// yLabelPrecision: 2,
			// minimumY: 1,
			// maximumY: 5,
		});
		asciiChart.draw();

		// More data
		points = [];
		for (var i = 0; i < Math.PI * 2; i += Math.PI / 100) {
			points.push([i, Math.sin(i)]);
		}

		asciiChart.updateData(points);
		asciiChart.draw();
	}

}

// Export
export { AsciiChartTest };
