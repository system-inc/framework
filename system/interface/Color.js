// Class
class Color {

    static getColorByPercentage(percentage, baseHue = 120) {
        var hue = ((1 - percentage) * baseHue).toString(10);
        return ['hsl(', hue, ', 100%, 50%)'].join('');
    }

}

// Export
export { Color };
