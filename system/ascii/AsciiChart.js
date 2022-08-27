// Dependencies
import { AsciiBox } from '@framework/system/ascii/AsciiBox.js';

// Class
class AsciiChart {

    data = null;
    title = null; // A caption to display above the chart
    titleAlignment = 'center';
    color = 'cyan'; // The color of the chart
    gridColor = 'gray'; // The color of the grid
    width = 100;
    height = 24;
    minimumX = null; 
    maximumX = null;
    minimumY = null; // The minimum y value for the chart (negative values not supported)
    maximumY = null;
    xLabelPrecision = null; // Number of decimals for x labels
    yLabelPrecision = null; // Number of decimals for y labels

    constructor(data, options = {}) {
        this.setData(data);

        if(options.title) { this.title = options.title; }
        if(options.titleAlignment) { this.titleAlignment = options.titleAlignment; }
        if(options.color) { this.color = options.color; }
        if(options.gridColor) { this.gridColor = options.gridColor; }
        if(options.width) { this.width = options.width; }
        if(options.height) { this.height = options.height; }
        if(options.minimumX) { this.minimumX = options.minimumX; }
        if(options.maximumX) { this.maximumX = options.maximumX; }
        if(options.minimumY) { this.minimumY = options.minimumY; }
        if(options.maximumY) { this.maximumY = options.maximumY; }
        if(options.xLabelPrecision) { this.xLabelPrecision = options.xLabelPrecision; }
        if(options.yLabelPrecision) { this.yLabelPrecision = options.yLabelPrecision; }
    }

    draw() {
        // Get the range meta data
        const rangeMeta = AsciiChart.rangeMetaFromPoints(this.data);
        // console.log('rangeMeta', rangeMeta);

        // Variables we will use for drawing the chart
        const minimumX = (this.minimumX !== null) ? this.minimumX : rangeMeta.minimumX;
        const maximumX = (this.maximumX !== null) ? this.maximumX : rangeMeta.maximumX;
        const xDelta = maximumX - minimumX;
        const minimumY = (this.minimumY !== null) ? this.minimumY : rangeMeta.minimumY;
        const maximumY = (this.maximumY !== null) ? this.maximumY : rangeMeta.maximumY;
        const yDelta = maximumY - minimumY;
        const uniqueXValues = rangeMeta.uniqueXValues;

        // Adjust the height if a caption is used
        let height = this.height;
        if(!this.title) {
            height -= 1;
        }

        // Set the y precision
        let yLabelPrecision = this.yLabelPrecision;
        if(yLabelPrecision == null) {
            // Constrain the number between 0 and 8
            yLabelPrecision = Math.floor(Number.constrain(Math.log((height / yDelta) * 5) / Math.LN10, 0, 8));
        }
        // console.log('yLabelPrecision', yLabelPrecision);

        // Determine the y label width
        const yLabelWidth = 1 + Math.max(minimumY.toFixed(yLabelPrecision).length, maximumY.toFixed(yLabelPrecision).length);

        // Set the width of the graph accounting for labels
        let width = this.width;
        width -= yLabelWidth;

        // Determine how many bars we will display
        const barCount = Math.min(uniqueXValues, width);
        const barWidth = Math.floor(width / barCount);

        // Set the x precision
        let xLabelPrecision = this.xLabelPrecision;
        if(xLabelPrecision == null) {
            // Constrain the number between 0 and 8
            xLabelPrecision = Math.floor(Number.constrain(Math.log((barCount / xDelta) * 5) / Math.LN10, 0, 8));
        }

        // Group the points by x value
        const groupedPoints = AsciiChart.groupPoints(this.data, barCount, minimumX, xDelta, minimumY, maximumY, height);
        // console.log('groupedPoints', groupedPoints);

        // Prerender y labels
        const yLabels = [];
        for(let currentRow = height - 1; currentRow >= 0; currentRow--) {
            const currentYLabel = (groupedPoints.minimum + ((groupedPoints.delta * currentRow) / (height - 1))).toFixed(yLabelPrecision);
            yLabels.unshift(currentYLabel);
        }

        // Find the longest x label length
        let xLabelWidth = 0;
        for(let currentBar = 0; currentBar < barCount; currentBar++) {
            const label = (minimumX + ((currentBar * xDelta) / (barCount - 1))).toFixed(xLabelPrecision);
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

        // Draw chart
        chartString += this.drawChartWithoutXLabels(height, yLabels, yLabelWidth, groupedPoints.groups, barWidth, this.color, this.gridColor) + '\n';
        chartString += ' '.repeat(yLabelWidth);

        // Draw x labels
        for(let currentXLabelIndex = 0; currentXLabelIndex < xLabelDisplayCount; currentXLabelIndex++) {
            const xLabelOffset = currentXLabelIndex * xLabelIterator;
            const currentXLabel = (minimumX + ((xLabelOffset * xDelta) / (barCount - 1))).toFixed(xLabelPrecision);
            chartString += currentXLabel;
            chartString += ' '.repeat((barWidth * xLabelIterator) - currentXLabel.length);
        }

        // console.log(chartString);

        let box = new AsciiBox(chartString, {
            title: this.title,
            titleAlignment: this.titleAlignment,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        });
        
        console.log(box.toString());
    };

    // draw chart minus x labels
    drawChartWithoutXLabels(height, yLabels, yLabelWidth, group, barWidth, color, gridColor) {
        // console.log('yLabels', yLabels)

        const output = [];

        for(let currentRow = height - 1; currentRow >= 0; currentRow--) {
            let rowString = this.drawRow(currentRow, yLabels, yLabelWidth, group, barWidth, color, gridColor, height);

            if(rowString) {
                output.push(rowString);
            }
        }

        return output.join('\n');
    }

    drawRow(row, yLabels, yLabelWidth, group, barWidth, color, gridColor, height) {
        return `${this.drawRowLabel(row, yLabels, yLabelWidth)} ${this.drawRowChart(row, group, barWidth, color, gridColor, height)}`;
    }

    drawRowLabel(row, yLabels, yLabelWidth) {
        const label = yLabels[row];

        return `${' '.repeat(yLabelWidth - label.length - 1)}${label}`;
    }

    drawRowChart(row, bar, barWidth, color, gridColor, height) {
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

    setData(data) {
        this.data = data;

        if(Object.is(this.data)) {
            this.data = this.data.toArray();
        }
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
