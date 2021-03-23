    lerp(start, stop, x) {
      return start + x * (stop - start);
    },

    generateColorPalette() {

      /*
      let start = hsluv.rgbToHsluv([254,240,217].map(e => e/255));
      let end = hsluv.rgbToHsluv([153,0,0].map(e => e/255));

      let colorPalette = [];

      let numColors = 7;

      for (let i = 0; i < numColors; i++) {
        let h = this.lerp(start[0], end[0], i / (numColors - 1)) % 360;
        let s = this.lerp(start[1], end[1], i / (numColors - 1));
        let l = this.lerp(start[2], end[2], i / (numColors - 1));
        colorPalette.push(hsluv.hsluvToRgb([h, s, l]).map(e => Math.round(255 * e)));
      }

      this.colorPalette = colorPalette;
      */

      this.colorPalette = this.colorBrewer[this.colorPaletteChoice][3];

      for (let i = 0; i < this.colors.length; i++) {
        this.colors[i].fill = this.colorPalette[i % 7];
      }

    },