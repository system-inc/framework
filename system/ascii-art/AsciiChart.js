// Dependencies
import { Statistics } from '@framework/system/statistics/Statistics.js';

// Class
class AsciiChart {

    static draw(points, options = {}, chartType = 'bar') {
        // Convert an object of points into an array
        if(Object.is(points)) {
            points = points.toArray();
        }
        // console.log('points', points);
        
        // Merge the chosen options on top of the default options
        options = {
            caption: null, // A caption to display above the chart
            color: 'cyan', // The color of the chart
            gridColor: 'gray', // The color of the grid
            width: 100, 
            height: 24,
            minimumX: null, 
            maximumX: null,
            minimumY: null, // The minimum y value for the chart (negative values not supported)
            maximumY: null,
            xLabelPrecision: null, // Number of decimals for x labels
            yLabelPrecision: null, // Number of decimals for y labels
        }.merge(options);
        console.log('options', options);
        
        // Get the range meta data
        const rangeMeta = AsciiChart.rangeMetaFromPoints(points);
        console.log('rangeMeta', rangeMeta);

        // Variables we will use for drawing the chart
        const minimumX = (options.minimumX !== null) ? options.minimumX : rangeMeta.minimumX;
        const maximumX = (options.maximumX !== null) ? options.maximumX : rangeMeta.maximumX;
        const xWidth = maximumX - minimumX;
        const minimumY = (options.minimumY !== null) ? options.minimumY : rangeMeta.minimumY;
        const maximumY = (options.maximumY !== null) ? options.maximumY : rangeMeta.maximumY;
        const yHeight = maximumY - minimumY;
        const uniqueXValues = rangeMeta.uniqueXValues;

        // Adjust the height if a caption is used
        let height = options.height;
        height -= 1 + !!options.caption;

        // Set the y precision
        let yLabelPrecision = options.yLabelPrecision;
        if(yLabelPrecision == null) {
            // Constrain the number between 0 and 8
            yLabelPrecision = Math.floor(Number.constrain(Math.log((height / yHeight) * 5) / Math.LN10, 0, 8));
        }
        // console.log('yLabelPrecision', yLabelPrecision);

        // Determine the y label width
        const yLabelWidth = 1 + Math.max(minimumY.toFixed(yLabelPrecision).length, maximumY.toFixed(yLabelPrecision).length);

        // Set the width of the graph accounting for labels
        let width = options.width;
        width -= yLabelWidth;

        // Determine how many bars we will display
        const barCount = Math.min(uniqueXValues, width);
        const barWidth = Math.floor(width / barCount);

        // Set the x precision
        let xLabelPrecision = options.xLabelPrecision;
        if(xLabelPrecision == null) {
            // Constrain the number between 0 and 8
            xLabelPrecision = Math.floor(Number.constrain(Math.log((barCount / xWidth) * 5) / Math.LN10, 0, 8));
        }

        // Group the points by x value
        const groupedPoints = AsciiChart.groupPoints(points, barCount, minimumX, xWidth, minimumY, maximumY, height);
        // console.log('groupedPoints', groupedPoints);

        // Prerender y labels
        const yLabels = [];
        for(let currentRow = height - 1; currentRow >= 0; currentRow--) {
            const currentYLabel = (groupedPoints.minimum + ((groupedPoints.delta * currentRow) / (height - 1))).toFixed(yLabelPrecision);

            // Do not put duplicate labels in
            if(currentYLabel != yLabels[0]) {
                yLabels.unshift(currentYLabel);
            }
            // If we have a duplicate label, decrement our height
            else {
                height -= 1;
            }
        }

        // Find the longest x label length
        let xLabelWidth = 0;
        for(let currentBar = 0; currentBar < barCount; currentBar++) {
            const label = (minimumX + ((currentBar * xWidth) / (barCount - 1))).toFixed(xLabelPrecision);
            xLabelWidth = Math.max(xLabelWidth, label.length);
        }

        // Determine how many x labels should be displayed
        let xLabelDisplayCount = barCount;
        let xLabelIterator = 1;
        while(((xLabelDisplayCount + 1) * xLabelWidth) >= (barCount * barWidth)) {
            xLabelDisplayCount = Math.floor(xLabelDisplayCount / 2);
            xLabelIterator *= 2;
        }

        // Build the chart string
        let chartString = '';

        // Add the caption
        if(options.caption != null) {
            chartString += ' '.repeat(yLabelWidth);
            chartString += options.color === 'ascii' ? options.caption : Terminal.style(options.caption, 'bold');
            chartString += '\n';
        }

        // Draw chart
        chartString += AsciiChart.drawChartWithoutXLabels(height, yLabels, yLabelWidth, groupedPoints.groups, barWidth, options.color, options.gridColor) + '\n';
        chartString += ' '.repeat(yLabelWidth);

        // Draw x labels
        for(let currentXLabelIndex = 0; currentXLabelIndex < xLabelDisplayCount; currentXLabelIndex++) {
            const xLabelOffset = currentXLabelIndex * xLabelIterator;
            const currentXLabel = (minimumX + ((xLabelOffset * xWidth) / (barCount - 1))).toFixed(xLabelPrecision);
            chartString += currentXLabel;
            chartString += ' '.repeat((barWidth * xLabelIterator) - currentXLabel.length);
        }

        console.log(chartString);
    };

    // draw chart minus x labels
    static drawChartWithoutXLabels(height, yLabels, yLabelWidth, group, barWidth, color, gridColor) {
        // console.log('yLabels', yLabels)

        const output = [];

        for(let currentRow = height - 1; currentRow >= 0; currentRow--) {
            let rowString = AsciiChart.drawRow(currentRow, yLabels, yLabelWidth, group, barWidth, color, gridColor, height);

            if(rowString) {
                output.push(rowString);
            }
        }

        return output.join('\n');
    }

    static drawRow(row, yLabels, yLabelWidth, group, barWidth, color, gridColor, height) {
        return `${AsciiChart.drawRowLabel(row, yLabels, yLabelWidth)} ${AsciiChart.drawRowChart(row, group, barWidth, color, gridColor, height)}`;
    }

    static drawRowLabel(row, yLabels, yLabelWidth) {
        const label = (row === 0) || (yLabels[row] !== yLabels[row - 1]) ? yLabels[row] : '';

        return `${' '.repeat(yLabelWidth - label.length - 1)}${label}`;
    }

    static drawRowChart(row, bar, barWidth, color, gridColor, height) {
        const result = [];
        
        for(const barHeight of bar) {
            switch(
                ((row > barHeight) && 1) || // Row is over bar
                ((row >= (barHeight - 0.25)) && 2) || // Row is top of bar
                ((row > (barHeight - 0.75)) && 3) || // Row is less than half into the bar
                4 // Row is in the bar
            ) {
                // Row is over bar
                case 1:
                    if(color === 'ascii') {
                        result.push(' '.repeat(barWidth));
                    }
                    else {
                        result.push(Terminal.style('_', gridColor).repeat(barWidth));
                    }
                    break;
                // Row is top of bar
                case 2:
                    if(color === 'ascii') {
                        result.push(' '.repeat(barWidth));
                    }
                    else {
                        let output = Terminal.style('_', color).repeat(Math.max(1, barWidth - 1));
                        output += (barWidth > 1 ? Terminal.style('_', gridColor) : '')
                        result.push(output);
                    }
                    break;
                // Row is less than half into the bar
                case 3:
                    if(color === 'ascii') {
                        result.push(' '.repeat(barWidth));
                    }
                    else {
                        let output = Terminal.style('▄', color).repeat(Math.max(1, barWidth - 1));
                        output += (barWidth > 1 ? Terminal.style('_', gridColor) : '');
                        result.push(output);
                    }
                    break;
                // Row is in the bar
                case 4:
                    if(color === 'ascii') {
                        result.push('X'.repeat(barWidth));
                    }
                    else {
                        let output = Terminal.style(' ', [color, 'inverse']).repeat(Math.max(1, barWidth - 1));
                        output += (barWidth > 1 ? Terminal.style('_', gridColor) : '');
                        result.push(output);
                    }
                    break;
                default:
                    result.push(undefined);
            }
        }

        return result.join('');
    }

    // Group points
    static groupPoints(points, groupCount, minimumX, width, minimumY, maximumY, height) {
        // Put points in groups
        const createGroups = function(points, groupCount, minimumX, xWidth) {
            const groups = [];

            // Loop through the points
            for(let point of points) {
                const x = point[0];

                // Find the group for the current x value
                const group = Math.min(groupCount - 1, Math.floor(((x - minimumX) / xWidth) * groupCount));

                // Create the group if it does not exist
                if(groups[group] == null) {
                    groups[group] = [];
                }
                
                // Add the point to the group
                groups[group].push(point);
            }

            // Fill in gaps between groups
            for(let i = 0; i < groups.length; i++) {
                if(groups[i] == null) {
                    groups[i] = [];
                }
            }

            return groups;
        };
        
        // Calculate the averages for all of the y values per group
        const averageGroups = function(groups) {
            return groups.map(function(group) {
                // If there are no values in the group
                if(!group.length) {
                    return 0;
                }
                
                // Calculate the average for the group
                return (1 / group.length) * group.reduce(function(sum, point) {
                    const yValue = point[1];
                    return sum + yValue;
                }, 0);
            });
        };
        
        // Get the group minimum and maximum values
        const getMinimumAndMaximumFromGroups = function(groups) {
            return {
                minimum: Math.min(groups),
                maximum: Math.max(groups)
            }
        };
        
        // Normalize groups
        const normalizeGroups = function(groups, minimum, delta, height) {
            return groups.map(function(group) {
                return ((group - minimum) / delta) * height;
            });
        }

        // Get the groups
        let groups = averageGroups(createGroups(points, groupCount, minimumX, width));
        
        let { minimum, maximum } = getMinimumAndMaximumFromGroups(groups);

        // Optionally override maximum with passed value
        if(maximumY != null) {
            maximum = maximumY;
        }

        // Optionally override minimum with passed value
        if(minimumY != null) {
            minimum = minimumY;
        }

        const delta = maximum - minimum;

        // Normalize the groups
        groups = normalizeGroups(groups, minimum, delta, height - 1);

        return { groups, minimum, maximum, delta };
    }

    // Get the minimum x, maximum x, minimum y, maximum y, and unique x values from the given points
    // Data is expected to be [[x, y], [x, y], ...]
    static rangeMetaFromPoints(points) {
        let xValues = [];

        let [ minimumX, maximumX, minimumY, maximumY ] = Array.from(points.reduce(
            function(previous, point) {
                if(!Array.from(xValues).includes(point[0])) {
                    xValues.push(point[0]);
                }

                return [
                    Math.min(previous[0], point[0]), Math.max(previous[1], point[0]),
                    Math.min(previous[2], point[1]), Math.max(previous[3], point[1])
                ];
            },
            [Infinity, -Infinity, Infinity, -Infinity]
        ));

        return { minimumX, maximumX, minimumY, maximumY, uniqueXValues: xValues.length };
    }

}

// Export
export { AsciiChart };
