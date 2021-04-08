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
      script.type = 'text/javascript';
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

    downloadPattern() {
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
      Object.assign(this.$data, this.dataBackup);
      this.dataBackup = JSON.parse(JSON.stringify(this.$data));
    },

    resetSelection() {
      this.selectedLines = [];
      this.selectedTiles = [];
    },

    submitPattern() {
      let pageURL = window.location.href.replaceAll('&', '%26');
      if (pageURL.includes('?')) {
        let submissionURL = 'https://docs.google.com/forms/d/e/1FAIpQLScen7v68Ba7DKnSyaRKcIyleu5jf3Ypyh--UzzJsO1np01I-A/formResponse?usp=pp_url&entry.206687101=';
        window.open(submissionURL + pageURL + '&submit=Submit');
      }
    },

    randomizeColors() {
      this.hue = Math.round(360 * Math.random());
      this.hueRange = Math.round(360 * Math.random()) - 180;
      this.contrast = Math.round(20 * Math.random()) + 30;
      this.sat = Math.round(30 * Math.random()) + 70;
    },

  },

  computed: {

    offsets() { // dependencies: symmetry, pattern, disorder, randomSeed
      let random = new Math.seedrandom('random seed ' + this.symmetry + ' and ' + this.randomSeed);
      return Array(this.symmetry).fill(this.pattern).map(e => (e + this.disorder * (random() - 0.5)) % 1);
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
            index: n + this.offsets[i]
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

                /*
                let xprime = x * c1 + y * s1;
                let yprime = - x * s1 + y * c1;
                */

                let rotationAngle = this.rotate * Math.PI / 180;
                let xprime = x * Math.cos(rotationAngle) - y * Math.sin(rotationAngle);
                let yprime = x * Math.sin(rotationAngle) + y * Math.cos(rotationAngle);

                // optimization: only list intersection points viewable on screen
                // this ensures we don't draw or compute tiles that aren't visible
                if (Math.abs(xprime * this.spacing) <= this.width/2 + this.spacing && Math.abs(yprime * this.spacing) <= this.height/2 + this.spacing) {

                  // this check ensures that we only draw tiles that are connected to other tiles
                  if ((this.steps == 1 && this.dist(x,y,0,0) <= 0.5 * this.steps) || this.dist(x,y,0,0) <= 0.5 * (this.steps - 1)) {
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
            //ellipse(x,y,5);
          }
          //fill(255,255,0);
          
          // calculate medians of these offset points
          let medianPts = [];
          let iMax = offsetPts.length;
          for (let i = 0; i < iMax; i++) {
            let x0 = offsetPts[i].x;
            let y0 = offsetPts[i].y;
            let x1 = offsetPts[ (i+1) % iMax ].x;
            let y1 = offsetPts[ (i+1) % iMax ].y;
            //line(x0,y0,x1,y1);
            
            let xm = (x0 + x1) / 2;
            let ym = (y0 + y1) / 2;

            medianPts.push({
              x: xm, 
              y: ym});
            //ellipse(xm, ym, 5);
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
            area += 0.5 * (dualPts[i].x * dualPts[(i+1) % dMax].y - dualPts[i].y * dualPts[(i+1) % dMax].x)
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

      if (!this.reverseColors) {
        return [start, end];
      } else {
        return [end, start];
      }
    },

    colorPalette() {

      // filter tiles to protoTiles, i.e. exactly one of each type of tile that needs to be colored
      // here we'll use the area property to do this
      let protoTiles = Object.values(this.intersectionPoints).filter((e, i, arr) => arr.findIndex(f => this.orientationColoring ? e.angles == f.angles : e.area == f.area) == i);

      let start = this.colors[0].slice();
      let end = this.colors[1].slice();

      let numTiles = protoTiles.length;
      let numColors = numTiles; 
      let colorPalette = [];
      let i = 0;

      for (let tile of protoTiles) {
        let h = this.lerp(start[0], end[0], i / (numColors - 1)) % 360;
        let s = this.lerp(start[1], end[1], i / (numColors - 1));
        let l = this.lerp(start[2], end[2], i / (numColors - 1));
        let color = hsluv.hsluvToRgb([h, s, l]).map(e => Math.round(255 * e));
        colorPalette.push({
          fill: this.rgbToHex(...color),
          points: this.normalize(tile.dualPts),
          area: tile.area,
          angles: tile.angles,
        });

        i++;
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
        if (parameter !== 'dataBackup' && value !== JSON.stringify(this.dataBackup[parameter])) {
          queryURL.append(parameter, value);
        }
      }

      queryURL= queryURL.toString();

      if (queryURL == '') {
        window.history.replaceState({}, 'Pattern Collider', location.pathname);
      } else {
        window.history.replaceState({}, 'Pattern Collider', '?' + queryURL);
      }

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

    disorder() {
      this.resetSelection();
    },

    randomSeed() {
      this.resetSelection();
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
    window.addEventListener("resize", this.onResize);
    setTimeout(() => {
      this.canvas1Resized = false;
      this.canvas2Resized = false;
    }, 500);
  },

  data: {
    dataBackup: {},
    urlParameters: ['symmetry', 'pattern', 'disorder', 'randomSeed', 'radius', 'zoom', 'rotate', 'colorTiles', 'showIntersections', 'stroke', 'showStroke', 'hue', 'hueRange', 'contrast', 'sat', 'reverseColors', 'orientationColoring'],
    symmetry: 5,
    radius: 36,
    pattern: 0.2,
    disorder: 0,
    randomSeed: 0.01,
    zoom: 1,
    showIntersections: true,
    colorTiles: true,
    orientationColoring: false,
    stroke: 70,
    showStroke: true,
    rotate: 0,
    hue: 338,
    hueRange: 65,
    contrast: 33.5,
    sat: 80,
    //startColor: [43, 100, 82],
    //endColor: [273, 13, 15],
    reverseColors: false,
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
  }

});
