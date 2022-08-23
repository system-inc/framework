// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { AsciiChart } from '@framework/system/ascii-art/AsciiChart.js';

// Class
class AsciiChartTest extends Test {

	async test() {
		var points = [
			[1,1],
			[2,1],
			[3,1],
			[4,5],
			[5,1.5],
		];

		// points = [];
		// for (var i = 0; i < Math.PI * 2; i += Math.PI / 100) {
		// 	points.push([i, Math.sin(i)]);
		// }

		AsciiChart.draw(points, {
			// color: 'ascii',
			caption: 'My Caption',
			gridColor: 'gray',
			width: 200,
			height: 50,
		});
	}

}

// Export
export { AsciiChartTest };
