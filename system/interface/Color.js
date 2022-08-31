// Class
class Color {

    static getColorByPercentage(percentage, baseHue = 120) {
        let hue = ((1 - percentage) * baseHue).toString(10);

        return ['hsl(', hue, ', 100%, 50%)'].join('');
    }

    // Color numbers 16 to 231 are RGB colors
    // These 216 colors are defined by 6 values on each of the three RGB axes
    // That is, instead of values 0 - 255, each color only ranges from 0 - 5
    // The color number is then calculated like this:
    // number = 16 + 36 * r + 6 * g + b
    static rgbToTerminalPaletteValue(red, green, blue) {
        let terminalPaletteValue = null;

        // If we are in grayscale, use values 232 (dark) through 255 (light)
        if(red === green && green === blue) {
            // Reindex red range 0 to 255 into a range between 0 to 23
            terminalPaletteValue = 232 + Math.round(red / 255 * 23);
        }
        // If we are in color, use values 16 through 231
        else {
            // If we are a color, convert red, green, and blue into a number between 0 and 5
            red = Math.round(red / 51);
            green = Math.round(green / 51);
            blue = Math.round(blue / 51);

            // Then, convert the numbers into a color number corresponding to the palette
            terminalPaletteValue = 16 + 36 * red + 6 * green + blue;
        }

        return terminalPaletteValue;
    }

    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        let rgb = null;

        if(result) {
            rgb = {
                red: parseInt(result[1], 16),
                green: parseInt(result[2], 16),
                blue: parseInt(result[3], 16),
            };
        }

        return rgb;
    }

    static hsbToRgb(hue, saturation = 1, brightness = 1) {
        var red, green, blue, hueInteger, hueFraction, lowestColorBrightness, middleColorBrightness, highestColorBrightness;
        
        hueInteger = Math.floor(hue * 6); // hueInteger is used to determine which of the three color brightnesses is used
        hueFraction = hue * 6 - hueInteger; // hueFraction is used to determine the actual brightness of the color
        lowestColorBrightness = brightness * (1 - saturation);
        middleColorBrightness = brightness * (1 - hueFraction * saturation);
        highestColorBrightness = brightness * (1 - (1 - hueFraction) * saturation);

        switch(hueInteger % 6) {
            case 0: red = brightness, green = highestColorBrightness, blue = lowestColorBrightness; break;
            case 1: red = middleColorBrightness, green = brightness, blue = lowestColorBrightness; break;
            case 2: red = lowestColorBrightness, green = brightness, blue = highestColorBrightness; break;
            case 3: red = lowestColorBrightness, green = middleColorBrightness, blue = brightness; break;
            case 4: red = highestColorBrightness, green = lowestColorBrightness, blue = brightness; break;
            case 5: red = brightness, green = lowestColorBrightness, blue = middleColorBrightness; break;
        }

        let color = {
            red: Math.round(red * 255),
            green: Math.round(green * 255),
            blue: Math.round(blue * 255)
        };

        if(isNaN(color.red) || isNaN(color.green) || isNaN(color.blue)) {
            throw new Error('hsbToRgb: invalid color');
        }

        return color;
    }

}

// Export
export { Color };
