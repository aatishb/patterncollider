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
        if(this.myp5.dataChanged) {
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

    randomColor() {
      return [Math.random(), Math.random(), Math.random()].map(e => 255 * e).map(e => (e + 255)/2);
    },

    randomizeColors() {
      for (let color of this.colors) {
        color.fill = this.rgbToHex(...this.randomColor());
      }
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
      return color.points.map(e => String(e[0] + 25) + ',' + String(e[1] + 25)).reduce((a,b) => a + ' ' + b);
    },

    SVGStyle(color) {
      return 'fill: ' + color.fill + '; stroke: ' + color.stroke + '; stroke-width: 1;';
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

    generateTiles() {

      // reset selections
      this.selectedLines = [];
      this.selectedTiles = [];

      this.colors = [];

      // calculate intersection points of lines on grid
      let pts = {};
      
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

      this.colors.forEach(e => e.onScreen = false);
      let colorPaletteIndex = 0;
      let colorPaletteLength = this.colorPalette.length;

      // calculate dual points to intersection points
      for (let pt of Object.values(pts)) {

        // sort angles of all edges that meet at an intersection point
        let angles = pt.lines.map(e => e.angle * this.multiplier);
        let angles2 = angles.map(e => (e + Math.PI) % (2 * Math.PI));
        // numerical sort angles and remove duplicates (e.g. due to degeneracy when offset = 0)
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
          
        for (let myPt of medianPts) {
          let xd = 0;
          let yd = 0;

          for (let i = 0; i < this.numGrids; i++) {
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
        }

        // compute area using determinant method
        let area = 0;
        let dMax = dualPts.length;
        for (let i = 0; i < dMax; i++) {
          area += 0.5 * (dualPts[i].x * dualPts[(i+1) % dMax].y - dualPts[i].y * dualPts[(i+1) % dMax].x)
        }

        area = String(Math.round(1000 * area) / 1000);

        let colorIndex = this.colors.findIndex(e => e.symmetry == this.numGrids && e.area == area && (this.orientationColoring ? JSON.stringify(e.angles) == JSON.stringify(angles) : true));

        if (colorIndex < 0) {

          this.colors.push({
            fill: this.rgbToHex(...this.colorPalette[colorPaletteIndex]),
            points: this.normalize(dualPts),
            symmetry: this.numGrids,
            area: area,
            angles: angles,
            onScreen: true
          });
          colorPaletteIndex = (colorPaletteIndex + 1) % colorPaletteLength;

        } else {
          this.colors[colorIndex].onScreen = true;
        }

        pt.angles = angles;
        pt.area = area;
        pt.dualPts = dualPts;
        /*
        tiles.push({
          points: dualPts,
          area: area
        })
        */

      }

      //this.tiles = tiles;
      
      this.intersectionPoints = pts;

    },

    onResize() {
      this.canvas1Resized = false;
      this.canvas2Resized = false;
    },

  },

  computed: {

    offsets() { // dependencies: numGrids, offset, ratio

      // create array
      let array =  Array(this.numGrids).fill(this.offset);
      // sum all but last element
      let normalize = array.slice(0, -1).reduce((a,b) => a + b, 0);
      // calculate desired sum based on phase
      let sum = this.phase + this.numGrids * this.offset;
      // set last element to enforce sum
      array[array.length - 1] = (sum - normalize) % 1;

      return array;
    },

    multiplier() { // dependencies: numGrids
      return 2 * Math.PI / this.numGrids;
    },

    steps() {
      // find nearest odd number to radius / (numGrids - 1)
      // normalized so that a pentagrid with radius 1 has 9 steps
      return 2* Math.round((36 * this.radius / (this.numGrids - 1) - 1)/2) + 1;
    },

    make1Dgrid() {
      return Array(this.steps).fill(0).map((e,i) => i - (this.steps-1)/2);
    },

    grid() { // dependencies: numGrids, steps, multiplier, offsets


      let lines = [];

      for (let i = 0; i < this.numGrids; i++) {
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

    // returns a table with sin & cos values for 2*PI*i/numGrids
    sinCosTable() {  // dependencies: numGrids, multiplier

      let table = [];
  
      for (let i = 0; i < this.numGrids; i++) {
        table.push({
          sin: Math.sin(i * this.multiplier), 
          cos: Math.cos(i * this.multiplier)
        });
      }

      return table;
    },

    canvasDisplaySetting() {
      if (this.canvas1Resized && this.canvas2Resized) {
        return '';
      } else {
        return 'none';
      }
    },

    visibleTiles() {
      return this.colors.filter(e => e.onScreen && e.symmetry == this.numGrids);
    },

  },

  mounted() {
    this.generateTiles();
    window.addEventListener("resize", this.onResize);
  },

  watch: {
    grid() {
      this.generateTiles();
    },
    showRibbons() {
      this.generateTiles();
    },
    orientationColoring() {
      this.generateTiles();      
    },
  },

  data: {
    numGrids: 5,
    radius: 1,
    offset: 0.2,
    phase: 1,
    zoom: 1,
    showIntersections: true,
    colorTiles: true,
    orientationColoring: false,
    showRibbons: true,
    intersectionPoints: {},
    tiles: [],
    colors: [],
    stroke: 70,
    rotate: 0,
    selectedLines: [],
    selectedTiles: [],
    epsilon: Math.pow(10, -6),
    inverseEpsilon: Math.pow(10, 6),
    mode: 'settings',
    canvas1Resized: false,
    canvas2Resized: false,
    colorPalette: [[255, 190, 137],
                   [255, 161, 155],
                   [202, 124, 152],
                   [141, 92, 131],
                   [85, 56, 100],
                   [55, 42, 80],
                   [40, 32, 68]
                   ]
  }

});
