/* 
TODO
- [ ] separate drawing tiles/grid from creating them
interaction:
- [ ] hover over lines to highlight
- [ ] hover over tiles to highlight
- [ ] click line to select ribbon
- [ ] click tile to select point
- [ ] show ribbon edges mode?
- [ ] SVG / highres export
*/

// PARAMETERS

let numGrids = 5;      // should be 3 or more
let steps = 10;        // more steps = larger area
let offset = 0.1;      // grid offset, between 0 and 1 (0 & 0.5 are singular)
let sum = 0.;          // sum of offsets, between 0 and 1 (0 & 0.5 are interesting)
let drawGrid = true;   // draws n-grid in background
let showTiles = true;  // show tiles
let colorTiles = true; // colors tiles

// END OF PARAMETERS

const epsilon = Math.pow(10,-6);
let shapes = {};
let cosTable = []
let sinTable = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  spacing = min(width,height)/(2*steps + 1);
  
  //fill(255,0,0);
  noFill();

  background(0,0,0.2*255);
  translate(width/2, height/2);
  
  let grid = [];
  let multiplier = 2 * PI / numGrids;
  
  for (let i = 0; i < numGrids; i++) {
    sinTable.push(sin(i*multiplier));
    cosTable.push(cos(i*multiplier));
  }
  
  let offsets = Array(numGrids).fill(offset);
  let normalize = offsets.slice(0,-1).reduce((a,b) => a+b, 0);
  offsets[offsets.length - 1] = sum - normalize;
  
  
  var t0 = new Date().getTime();
  for (let i = 0; i < numGrids; i++) {
    for (let n = -steps; n <= steps; n++) {
      // grid is a set of tuples of [angle, index] for each grid line
      grid.push([ multiplier * i, spacing * (n + offsets[i]) ]);
    }
  }
  
  stroke(255,0,0);
  if (drawGrid){
    drawLines(grid);  
  }
  
  if (colorTiles) {
    stroke(128);  
  } else {
    stroke(0,255,0);
  }
  
  console.log('grid size: ' + grid.length + ' points');
  var t1 = new Date().getTime();
  console.log("Creating grids took " + (t1 - t0) + " milliseconds.")  
  
  if (showTiles) {

    let intersections = findIntersections(grid, spacing, steps);
    var t2 = new Date().getTime();
    console.log("findIntersections took " + (t2 - t1) + " milliseconds.")  

    for (let pt of Object.values(intersections)) {
      let medianPts = findMedianPoints(pt);
      findDualPoints(medianPts, spacing, multiplier, offsets, numGrids);
    }
    var t3 = new Date().getTime();
    console.log("medianPts & findDualPoints took " + (t3 - t2) + " milliseconds.")  
    
  }

  
  noLoop();
}

function draw() {
}

function findMedianPoints(pt) {
  
    // sort angles of all edges that meet at an intersection point
    let angles = [... new Set(pt.angles)];
    let angles2 = pt.angles.map(e => (e + PI) % (2*PI));
    angles = [...angles, ...angles2].sort();
    
    //fill(255, 0, 0);

    // calculate points offset along these edges
    let offsetPts = [];
    for (let angle of angles) {
      let x = pt.x + epsilon * -sin(angle);
      let y = pt.y + epsilon * cos(angle);
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
    for (let i=0;i<iMax; i++) {
      let x0 = offsetPts[i].x;
      let y0 = offsetPts[i].y;
      let x1 = offsetPts[(i+1)%iMax].x;
      let y1 = offsetPts[(i+1)%iMax].y;
      //line(x0,y0,x1,y1);
      
      let xm = (x0+x1)/2;
      let ym = (y0+y1)/2;
      medianPts.push({
        x: xm, 
        y: ym});
      //ellipse(xm, ym, 5);
    }
  
    return medianPts;
}


function findDualPoints(medianPts, spacing, anglePrefix, offset, numGrids) {
    
  let dualPts = [];
    
  for (let pt of medianPts) {
    let xd = 0;
    let yd = 0;

    for (let i = 0; i < numGrids; i++) {
      let k = floor((pt.x/spacing) * cosTable[i] + (pt.y/spacing) * sinTable[i] - offset[i]);
      xd += spacing * k * cosTable[i] * (2/numGrids);
      yd += spacing * k * sinTable[i] * (2/numGrids);
    }

    dualPts.push({
      x: xd, 
      y: yd
    });
  }

  let dMax = dualPts.length;
      
  if (colorTiles) {

    // compute area using determinant method
    let area = 0;
    for (let i=0; i<dMax; i++) {
      area += 0.5 * (dualPts[i].x * dualPts[(i+1)%dMax].y - dualPts[i].y * dualPts[(i+1)%dMax].x)
    }

    area = str(round(1000000*area)/1000000);

    if (!Object.keys(shapes).includes(area)) {
      let r = random(50,255);
      let g = random(50,255);
      let b = random(50,255);
      let o = 50;

      shapes[area] = {
        color: color((r+255)/2, (g+255)/2, (b+255)/2),
        dualColor: color((r+o)/2, (g+o)/2, (b+o)/2),
        points: dualPts
      };
    }
    
    fill(shapes[area].color);
    stroke(shapes[area].dualColor);
    
  }

  beginShape();
  for (let i=0;i<dMax; i++) {
    let x = dualPts[i].x;
    let y = dualPts[i].y;
    vertex(x,y);
    //let x1 = dualPts[(i+1)%dMax].x;
    //let y1 = dualPts[(i+1)%dMax].y;
    //line(x0,y0,x1,y1);
  }
  endShape(CLOSE);
  
}

function findIntersections(grid, spacing, steps) {
   
  let pts = {};
  //let angle1 = grid[20][0];
  //let index1 = grid[20][1];
  
  for (let [angle1, index1] of grid) {
    for (let [angle2, index2] of grid) {
      if (angle1 < angle2) {
        let s1 = sin(angle1);
        let s2 = sin(angle2);
        let c1 = cos(angle1);
        let c2 = cos(angle2);
        let s12 = sin(angle1-angle2);
        let s21 = sin(angle2-angle1);

        let x = (index2 * s1 - index1 * s2)/s12;
        let y = (index2 * c1 - index1 * c2)/s21;
        
        if (dist(x,y,0,0) <= spacing * steps && 
            x > -width/2 - spacing && 
            x < width/2 + spacing && 
            y > -height/2 - spacing && 
            y < height/2 + spacing  
           ) {

          let index = JSON.stringify([round(1000000*x)/1000000,round(1000000*y)/1000000]);
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
  
  return pts;
}


function drawLines(grid) {
  for (let [angle, index] of grid) {
    drawLine(angle, index);
  }
}

// angle, index
function drawLine(angle, index) {
  let x0 = getXVal(angle, index, -height/2);
  let x1 = getXVal(angle, index, height/2);
  if (x0 && x1) {
    line(x0, -height/2, x1, height/2);
  } else {
    let y0 = getYVal(angle, index, -width/2);
    let y1 = getYVal(angle, index, width/2);
    line(-width/2, y0, width/2, y1);
  }
}

// angle, index
function getXVal(angle, index, y) {
  return (index - y * sin(angle))/cos(angle);
}

// angle, index
function getYVal(angle, index, x) {
  return (index - x * cos(angle))/sin(angle);
}