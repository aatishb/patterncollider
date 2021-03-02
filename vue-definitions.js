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
      return Math.round(1000*x)/1000;
    },

    dist(x,y) {
      return Math.sqrt(x*x + y*y);
    },

    generateIntersectionPoints() {

      let pts = {};
      
      for (let [angle1, index1] of this.grid) {
        for (let [angle2, index2] of this.grid) {
          if (angle1 < angle2) {

            let sc1 = this.sinCosTable[angle1];
            let s1 = sc1.sin;
            let c1 = sc1.cos;

            let sc2 = this.sinCosTable[angle2];
            let s2 = sc2.sin;
            let c2 = sc2.cos;

            let s12 = s1 * c2 - c1 * s2;
            let s21 = -s12;

            let x = (index2 * s1 - index1 * s2)/s12;
            let y = (index2 * c1 - index1 * c2)/s21;

            let xprime = x * c1 + y * s1;
            let yprime = - x * s1 + y * c1;
            
            if (this.dist(x,y) <= this.steps + 0.5) {

              let index = JSON.stringify([this.approx(x), this.approx(y)]);
              if (pts[index]) {
                pts[index].angles.push(angle2);
                pts[index].angles.push(angle1);
              } else {
                pts[index] = {};
                pts[index].x = x;
                pts[index].y = y;
                pts[index].angles = [angle1, angle2];
              }
            }
          }
        }
      }
      
      this.intersectionPoints = pts;

    },

    generateTiles() {

      let tiles = [];

      for (let pt of Object.values(this.intersectionPoints)) {

        // sort angles of all edges that meet at an intersection point
        let angles = pt.angles.filter((e, i, arr) => arr.indexOf(e) == i).map(e => e * this.multiplier);
        let angles2 = angles.map(e => (e + Math.PI) % (2 * Math.PI));
        angles = [...angles, ...angles2].sort((a,b) => a - b); // numerical sort
        
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

        if (!Object.keys(this.colors).includes(area)) {
          let r = (255 - 50) * Math.random() + 50;
          let g = (255 - 50) * Math.random() + 50;
          let b = (255 - 50) * Math.random() + 50;
          let o = 50;

          this.colors[area] = {
            color: [(r + 255) / 2, (g + 255) / 2, (b + 255) / 2],
            stroke: [(r + o) / 2, (g + o) / 2, (b + o) / 2],
          };
        }

        tiles.push({
          points: dualPts,
          color: this.colors[area].color,
          stroke: this.colors[area].stroke
        })

      }

      this.tiles = tiles;

    },

  },

  computed: {

    offsets() { // dependencies: numGrids, offset, sum

      // create array
      let array =  Array(this.numGrids).fill(this.offset);
      // sum all but last element
      let normalize = array.slice(0,-1).reduce((a,b) => a+b, 0);
      // set last element to enforce sum
      array[array.length - 1] = this.sum - normalize;

      return array;
    },

    multiplier() { // dependencies: numGrids
      return 2 * Math.PI / this.numGrids;
    },

    grid() { // dependencies: numGrids, steps, multiplier, offsets


      let table = [];

      for (let i = 0; i < this.numGrids; i++) {
        for (let n = -this.steps; n <= this.steps; n++) {
          // grid is a set of tuples of [angle, index] for each grid line
          table.push([ i, (n + this.offsets[i]) ]);
        }
      }

      return table;
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

  },

  mounted() {
    this.generateIntersectionPoints();
    this.generateTiles();
  },

  watch: {
    grid() {
      this.generateIntersectionPoints();
      this.generateTiles();
    }
  },

  data: {
    numGrids: 5,
    steps: 10,
    offset: 0.1,
    sum: 0,
    intersectionPoints: {},
    tiles: [],
    colors: {},
    epsilon: Math.pow(10,-4),
  }

});
