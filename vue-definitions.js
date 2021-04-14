// Defines a Vue <p5> Component

Vue.component('p5', {

  template: '<div></div>',

  props: ['src','data'],

  methods: {
    // loadScript from https://stackoverflow.com/a/950146
    // loads the p5 javscript code from a file
    loadScript: function (url, callback)
    {
      // Adding the script tag to the head as suggested before
      var head = document.head;
      var script = document.createElement('script');
      //script.type = 'text/javascript';
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = callback;
      script.onload = callback;

      // Fire the loading
      head.appendChild(script);
    },

    loadSketch: function() {
      this.myp5 = new p5(sketch(this));
    }
  },

  data: function() {
    return {
      myp5: {}
    }
  },

  mounted() {
    this.loadScript(this.src, this.loadSketch);
  },

  watch: {
    data: {
      handler: function(val, oldVal) {
        if(this.myp5.dataChanged && this.myp5._setupDone) {
          this.myp5.dataChanged(val, oldVal);
        }
      },
      deep: true
    }
  }

});

// Sets up the main Vue instance

var app = new Vue({
  el: '#root',

  methods: {

    approx(x) {
      return Math.round(x * this.inverseEpsilon) / this.inverseEpsilon;
    },

    dist(x1,y1, x2, y2) {
      let dx = x2 - x1;
      let dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    },

    normalize(points) {

      let numPts = points.length;

      let xbar = 0;
      let ybar = 0;
      let dist = 0;

      // find longest diagonal
      for (let i = 0; i < numPts; i++) {
        xbar += points[i].x;
        ybar += points[i].y;
        for (let j = i; j < numPts; j++) {
          let d = this.dist(points[i].x, points[i].y, points[j].x, points[j].y);
          if (d > dist) {
            dist = d;
            //angle = Math.atan2(points[j].y - points[i].y, points[j].x - points[i].x);
          }
        }
      }

      // calculate mean point
      xbar /= numPts;
      ybar /= numPts;

      // subtract mean and normalize based on length of longest diagonal
      return points.map(e => [50 * (e.x - xbar) / dist, 50 * (e.y - ybar) / dist]);

    },

    convertPointstoString(points) {
      return points.map(e => String(e[0] + 25) + ',' + String(e[1] + 25)).reduce((a,b) => a + ' ' + b)
    },

    SVGPoints(color) {
      return this.convertPointstoString(color.points);
    },

    SVGStyle(color) {
      return 'fill: ' + color.fill + '; stroke: ' + this.rgbToHex(this.stroke, this.stroke, this.stroke) + '; stroke-width: 1;';
    },

    clearSelection() {
      this.selectedLines = [];
      this.selectedTiles = [];
    },

    // from stack exchange https://stackoverflow.com/a/5624139
    rgbToHex(r, g, b) {
      let R = Math.round(r);
      let G = Math.round(g);
      let B = Math.round(b);

      return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    },

    onResize() {
      this.canvas1Resized = false;
      this.canvas2Resized = false;
    },

    lerp(start, stop, x) {
      return start + x * (stop - start);
    },

    reset() {
      // pressing reset shouldn't change mode, fullscreen & show
      // i.e. it should only reset pattern properties
      this.dataBackup.mode = this.$data.mode;
      this.dataBackup.fullscreen = this.$data.fullscreen;
      this.dataBackup.show = this.$data.show;

      // reset data to backup
      Object.assign(this.$data, this.dataBackup);
      
      // and then recreate the backup, because resetting the data also emptied the backup
      this.dataBackup = JSON.parse(JSON.stringify(this.$data));
    },

    resetSelection() {
      this.selectedLines = [];
      this.selectedTiles = [];
    },

    randomizeColors() {
      this.hue = Math.round(360 * Math.random()); // 0 to 360
      this.hueRange = Math.round(360 * Math.random()) - 180; // -180 to 180
      this.contrast = Math.round(25 * Math.random()) + 25; // 25 to 50
      this.sat = Math.round(40 * Math.random()) + 60; // 60 to 100
    },

    updateURL(queryURL) {

      if (queryURL == '') {
        window.history.replaceState({}, 'Pattern Collider', location.pathname);
      } else {
        window.history.replaceState({}, 'Pattern Collider', '?' + queryURL);
      }

    },

    copyURLToClipboard() {

      const el = document.createElement('textarea');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      alert("Link copied to clipboard");
    }, 

    requestFullscreen() {

      if (!this.fullscreen) {
        let el = document.documentElement;

        if (el.requestFullscreen) { // https://www.w3schools.com/jsref/met_element_requestfullscreen.asp
          el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) { /* Safari */
          el.webkitRequestFullscreen();
        }

      } else {

        if (document.exitFullscreen) { // https://www.w3schools.com/jsref/met_element_exitfullscreen.asp
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        }

      }

    },

  },

  computed: {

    offsets() { // dependencies: symmetry, pattern, disorder, randomSeed

      let offsets =  Array(this.symmetry).fill(this.pattern);

      if (this.disorder > 0) {
        let random = new Math.seedrandom('random seed ' + this.symmetry + ' and ' + this.randomSeed);
        offsets = offsets.map(e => e + this.disorder * (random() - 0.5));
      }

      if (this.glide > 0) {
        offsets = offsets.map((e,i) => e - this.steps * this.glide * this.glideShift[i]);
      }

      return offsets.map(e => e);
    },

    multiplier() { // dependencies: symmetry
      return 2 * Math.PI / this.symmetry;
    },

    steps() {
      // find nearest odd number to radius / (symmetry - 1)
      return 2* Math.round((this.radius / (this.symmetry - 1) - 1)/2) + 1;
    },

    spacing() {
      return this.zoom * Math.min(this.width, this.height) / (this.steps);
    },

    make1Dgrid() {
      return Array(this.steps).fill(0).map((e,i) => i - (this.steps-1)/2);
    },

    grid() { // dependencies: symmetry, steps, multiplier, offsets


      let lines = [];

      for (let i = 0; i < this.symmetry; i++) {
        for (let n of this.make1Dgrid) {

          // grid is a set of tuples of {angle: angle, index: index} for each grid line
          // TODO fix degeneracy issue: there can be multiple lines that coincide
          lines.push({
            angle: i,
            index: n + this.offsets[i] % 1
          });

        }
      }

      return lines;
    },

    // returns a table with sin & cos values for 2*PI*i/symmetry
    sinCosTable() {  // dependencies: symmetry, multiplier

      let table = [];
  
      for (let i = 0; i < this.symmetry; i++) {
        table.push({
          sin: Math.sin(i * this.multiplier), 
          cos: Math.cos(i * this.multiplier)
        });
      }

      return table;
    },

    sinCosRotate() {

      let angle = this.rotate * Math.PI / 180;

      return { 
        sin: Math.sin(angle),
        cos: Math.cos(angle)
      };

    },

    glideShift() {
      // use cosine difference formula with lookup tables for optimization
      return this.sinCosTable.map(e => e.cos * this.sinCosRotate.cos - e.sin * this.sinCosRotate.sin);
    },

    intersectionPoints() {

      // calculate intersection points of lines on grid
      let pts = {};

      if (this.width && this.height) {

        for (let line1 of this.grid) {
          for (let line2 of this.grid) {
            if (line1.angle < line2.angle) {

              let sc1 = this.sinCosTable[line1.angle];
              let s1 = sc1.sin;
              let c1 = sc1.cos;

              let sc2 = this.sinCosTable[line2.angle];
              let s2 = sc2.sin;
              let c2 = sc2.cos;

              let s12 = s1 * c2 - c1 * s2;
              let s21 = -s12;

              // avoid edge case where angle difference = 60 degrees
              if (Math.abs(s12) > this.epsilon) {

                let x = (line2.index * s1 - line1.index * s2) / s12;
                let y = (line2.index * c1 - line1.index * c2) / s21;

                let rotationAngle = this.rotate * Math.PI / 180;
                let xprime = x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle);
                let yprime = x * Math.sin(rotationAngle) + y * Math.cos(rotationAngle);

                // optimization: only list intersection points viewable on screen
                // this ensures we don't draw or compute tiles that aren't visible
                if (Math.abs(xprime * this.spacing) <= this.width / 2 + 1.5 * this.spacing 
                && Math.abs(yprime * this.spacing) <= this.height / 2 + 1.5 * this.spacing) {

                  // this check ensures that we only draw tiles that are connected to other tiles
                  if ((this.steps == 1 && this.dist(x,y,0,0) <= 0.5 * this.steps) 
                                       || this.dist(x,y,0,0) <= 0.5 * (this.steps - 1)) {
                    let index = JSON.stringify([this.approx(x), this.approx(y)]);
                    if (pts[index]) {
                      if (!pts[index].lines.includes(line1)) {
                        pts[index].lines.push(line1);
                      }
                      if (!pts[index].lines.includes(line2)) {
                        pts[index].lines.push(line2);
                      }
                    } else {
                      pts[index] = {};
                      pts[index].x = x;
                      pts[index].y = y;
                      pts[index].lines = [line1, line2];
                    }
                  }

                }
              }
            }
          }
        }

        // calculate dual points to intersection points
        for (let pt of Object.values(pts)) {

          // sort angles of all edges that meet at an intersection point
          let angles = pt.lines.map(e => e.angle * this.multiplier);
          let angles2 = angles.map(e => (e + Math.PI) % (2 * Math.PI));
          // numerical sort angles and remove duplicates (e.g. due to degeneracy when phase = 0)
          angles = [...angles, ...angles2].map(e => this.approx(e)).sort((a,b) => a - b).filter((e, i, arr) => arr.indexOf(e) == i);

          // calculate points offset along these edges
          let offsetPts = [];
          for (let angle of angles) {
            let x = pt.x + this.epsilon * -Math.sin(angle);
            let y = pt.y + this.epsilon * Math.cos(angle);
            offsetPts.push({
              x:x,
              y:y
            });
          }
          
          // calculate medians of these offset points
          let medianPts = [];
          let iMax = offsetPts.length;
          for (let i = 0; i < iMax; i++) {
            let x0 = offsetPts[i].x;
            let y0 = offsetPts[i].y;
            let x1 = offsetPts[ (i+1) % iMax ].x;
            let y1 = offsetPts[ (i+1) % iMax ].y;
            
            let xm = (x0 + x1) / 2;
            let ym = (y0 + y1) / 2;

            medianPts.push({
              x: xm, 
              y: ym});
          }

          // calculate dual of these median points      
          let dualPts = [];
          let mean = {x: 0, y: 0};
            
          for (let myPt of medianPts) {
            let xd = 0;
            let yd = 0;

            for (let i = 0; i < this.symmetry; i++) {
              let ci = this.sinCosTable[i].cos;
              let si = this.sinCosTable[i].sin;

              let k = Math.floor(myPt.x * ci + myPt.y * si - this.offsets[i]);

              xd += k * ci;
              yd += k * si;
            }

            dualPts.push({
              x: xd, 
              y: yd
            });
            mean.x += xd;
            mean.y += yd;

          }

          let dMax = dualPts.length;
          mean.x /= dMax;
          mean.y /= dMax;

          // compute area using determinant method
          let area = 0;
          for (let i = 0; i < dMax; i++) {
            area += 0.5 * (dualPts[i].x * dualPts[(i+1) % dMax].y - dualPts[i].y * dualPts[(i+1) % dMax].x);
          }

          area = String(Math.round(1000 * area) / 1000);
          pt.area = area;
          pt.angles = JSON.stringify(angles);
          pt.dualPts = dualPts;
          pt.mean = mean;

        }        
      }
      
      return pts;

    },

    colors() {
      let lightness = 50;

      let start = [this.hue + this.hueRange, this.sat, lightness + this.contrast];
      let end = [this.hue - this.hueRange, this.sat, lightness - this.contrast];
      
      return [start, end];
    },

    colorPalette() {

      // filter tiles to protoTiles, i.e. exactly one of each type of tile that needs to be colored
      // depending on how we want to color the tiles, filter by area or by orientation
      let protoTiles = Object.values(this.intersectionPoints).filter((e, i, arr) => arr.findIndex(f => this.orientationColoring ? e.angles == f.angles : e.area == f.area) == i);
      let numTiles = protoTiles.length; 

      let start = this.colors[0].slice();
      let end = this.colors[1].slice();

      let i = 0;
      let colorPalette = [];
      let range = numTiles - 1/2;

      for (let tile of protoTiles) {
        let h = this.lerp(start[0], end[0], i / range) % 360;
        let s = this.lerp(start[1], end[1], i / range);
        let l = this.lerp(start[2], end[2], i / range);
        let color = hsluv.hsluvToRgb([h, s, l]).map(e => Math.round(255 * e));
        colorPalette.push({
          fill: this.rgbToHex(...color),
          points: this.normalize(tile.dualPts),
          area: tile.area,
          angles: tile.angles,
        });

        i++;
      }

      if (this.reverseColors) {
        let reversedColorPalette = colorPalette.map(e => e.fill).reverse();
        colorPalette.forEach((e,i) => e.fill = reversedColorPalette[i]);
      }

      return colorPalette;

    },

    canvasDisplaySetting() {
      if (this.canvas1Resized && this.canvas2Resized) {
        return '';
      } else {
        return 'none';
      }
    },

    queryURL() {
      
      let queryURL = new URLSearchParams();

      for (let parameter of this.urlParameters) {
        let value = JSON.stringify(this.$data[parameter]);
        if (parameter !== 'dataBackup' && value !== JSON.stringify(this.dataBackup[parameter]) && !(parameter == 'randomSeed' && this.$data['disorder'] == 0)) {
          queryURL.append(parameter, value);
        }
      }

      queryURL = queryURL.toString();

      // debounce URL update: only update URL once every 500ms
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.updateURL(queryURL);
      }, 200);

      return queryURL;

    },

  },

  watch: {

    symmetry() {
      this.resetSelection();
    },

    pattern() {
      this.resetSelection();
    },

    radius() {
      this.resetSelection();      
    },

    rotate() {
      this.resetSelection();      
    },

    glide() {
      this.resetSelection();      
    },

    disorder() {
      this.resetSelection();
    },

    randomSeed() {
      this.resetSelection();
    },

    show() {
      this.canvas1Resized = false;
      this.canvas2Resized = false;
    },

  },

  created() {
    this.dataBackup = JSON.parse(JSON.stringify(this.$data));

    let url = window.location.href.split('?');
    if (url.length > 1) {
      let urlParameters = new URLSearchParams(url[1]);
      for (const [parameter, value] of urlParameters) {
        if (this.urlParameters.includes(parameter)) {
          this.$data[parameter] = JSON.parse(value);
        }
      }      
    }
  },

  mounted() {

    let context = this;

    window.addEventListener("resize", this.onResize);

    setTimeout(() => {
      context.canvas1Resized = false;
      context.canvas2Resized = false;
    }, 500);


    window.addEventListener("fullscreenchange", e => {
      context.fullscreen = document.fullscreen;
      context.canvas1Resized = false;
      context.canvas2Resized = false;
    });

    window.addEventListener("webkitfullscreenchange", e => {
      context.fullscreen = document.webkitCurrentFullScreenElement;
      context.canvas1Resized = false;
      context.canvas2Resized = false;
    });

  },

  data: {
    dataBackup: {},
    urlParameters: ['symmetry', 'pattern', 'glide', 'disorder', 'randomSeed', 'radius', 'zoom', 'rotate', 'colorTiles', 'showIntersections', 'stroke', 'showStroke', 'hue', 'hueRange', 'contrast', 'sat', 'reverseColors', 'orientationColoring'],
    symmetry: 5,
    radius: 40,
    pattern: 0.2,
    glide: 0,
    disorder: 0,
    randomSeed: 0.00,
    zoom: 1,
    showIntersections: true,
    colorTiles: true,
    orientationColoring: false,
    stroke: 128,
    showStroke: false,
    rotate: 0,
    hue: 342,
    hueRange: 62,
    contrast: 36,
    sat: 74,
    reverseColors: false,
    show: 'Grid & Tiling',
    tiles: [],
    selectedLines: [],
    selectedTiles: [],
    epsilon: Math.pow(10, -6),
    inverseEpsilon: Math.pow(10, 6),
    canvas1Resized: false,
    canvas2Resized: false,
    width: 0,
    height: 0,
    gridDownloadCount: 0,
    tilingDownloadCount: 0,
    mode: 'shape',
    fullscreen: false,
    fullscreenPossible: document.fullscreenEnabled || document.webkitFullscreenEnabled
  }

});
