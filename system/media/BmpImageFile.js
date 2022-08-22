// Dependencies
import { ImageFile } from '@framework/system/media/ImageFile.js';
import * as fs from 'fs';
import { PseudorandomNumberGenerator } from '@framework/system/cryptography/PseudorandomNumberGenerator.js';

// Class
class BmpImageFile extends ImageFile {

    bitsPerPixel = 24;

    pseudorandomNumberGenerator = new PseudorandomNumberGenerator();

    testCreation() {
        // https://en.wikipedia.org/wiki/BMP_file_format

        console.log('this.width', this.width, 'this.height', this.height);

        // Each row in the Pixel array is padded to a multiple of 4 bytes in size
        let rowSize = Math.floor((this.bitsPerPixel * this.width + 31) / 32 ) * 4;
        console.log('rowSize', rowSize);

        let pixelArraySize = rowSize * this.height;
        console.log('pixelArraySize', pixelArraySize);
    
        let BMP = new DataView(new ArrayBuffer(54));
    
        // Bitmap file header
        'BM'.split('').map((v, i) => {
            BMP.setUint8(i, v.charCodeAt(0));
        });

        BMP.setUint32(2,  pixelArraySize + 54, true);   // File size (bytes): pixel array size + headers (=54 bytes)
        BMP.setUint16(6,  0, true);                     // Reserved
        BMP.setUint16(8,  0, true);                     // Reserved
        BMP.setUint32(10, 54, true);                    // Pixel array offset (=54 bytes)

        // DIB header, Windows BITMAPINFOHEADER
        BMP.setUint32(14, 40, true);                    // DIB header size (=40 bytes)
        BMP.setUint32(18, this.width, true);                 // Width in pixels
        BMP.setUint32(22, this.height, true);                // Height in pixels
        BMP.setUint16(26, 1, true);                     // Number of color planes (1)
        BMP.setUint16(28, this.bitsPerPixel, true);                   // Bits per pixel
        BMP.setUint32(30, 0, true);                     // No compression (0)
        BMP.setUint32(34, pixelArraySize, true);        // Size of the raw bitmap data (bytes) including rows padding
        BMP.setUint32(38, 2835, true);                  // Horizontal resolution (pixels per metre, signed integer), 2835 dpm = 72 dpi
        BMP.setUint32(42, 2835, true);                  // Vertical resolution, 2835 dpm = 72 dpi
        BMP.setUint32(46, 0, true);                     // Number of colors in the palette (keep 0 for default 2^bpp)
        BMP.setUint32(50, 0, true);                     // Important colors (0 = every color is important)

        let bmpData = new DataView(new ArrayBuffer(pixelArraySize));

        // Offset of a pixel value
        let i = 0;
        let byesPerPixel = (this.bitsPerPixel / 8) | 0;
    
        // From bottom row to the top
        for(let y = this.height - 1; y >= 0; y--) {
            for (let x = 0; x < this.width; x++) {

                // temp: Using the pseudorandom number generator to get a random number between 0 and 1
                bmpData.setUint8(i, this.pseudorandomNumberGenerator.randomBoolean() ? 0 : 255); // B
                bmpData.setUint8(i + 1, 0); // G
                bmpData.setUint8(i + 2, 0); // R

                i += byesPerPixel;
            }
            i = rowSize * (this.height - y);
        }

        let buffer = Buffer.concat([
            Buffer.from(BMP.buffer),
            Buffer.from(bmpData.buffer)
        ]);
    
        let outFile = 'out.bmp';
        fs.writeFileSync(outFile, buffer);
        console.log('File saved to ' + outFile);
    }
}

// Export
export { BmpImageFile };
