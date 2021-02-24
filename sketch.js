const epsilon = Math.pow(10,-6);

let colors = [
'#ffe3d8', // light
'#03506f', // dark
'indigo',
'palegoldenrod',
'lemonchiffon',
];

let shapes = [];
let cosTable = []
let sinTable = [];

function setup() {
  createCanvas(1000, 1000);

  //fill(255,0,0);
  //noFill();
  stroke(220);

  background(0,0,0.2*255);
  translate(width/2, height/2);
  
  let grid = [];
  let spacing = 10;
  let steps = 20;
  let numGrids = 5;
  let multiplier = 2 * PI / numGrids;
  
  for (let i = 0; i < 5; i++) {
    sinTable.push(sin(i*multiplier));
    cosTable.push(cos(i*multiplier));
  }
  
  let offsets = Array(numGrids).fill(0.1);
  let sum = offsets.slice(0,-1).reduce((a,b) => a+b, 0);
  offsets[offsets.length - 1] = 0.5 - sum;
  
  
  var t0 = new Date().getTime();
  for (let i = 0; i < numGrids; i++) {
    for (let n = -steps; n <= steps; n++) {
      // grid is a set of tuples of [angle, index] for each grid line
      grid.push([ multiplier * i, spacing * (n + offsets[i]) ]);
    }
  }
  
  //drawLines(grid);
  
  console.log('grid size: ' + grid.length + ' points');
  var t1 = new Date().getTime();
  console.log("Creating grids took " + (t1 - t0) + " milliseconds.")  
  
  let intersections = findIntersections(grid, spacing);
  var t2 = new Date().getTime();
  console.log("findIntersections took " + (t2 - t1) + " milliseconds.")  

  for (let pt of Object.values(intersections)) {
    let medianPts = findMedianPoints(pt);
    findDualPoints(medianPts, spacing, multiplier, offsets);
  }
  var t3 = new Date().getTime();
  console.log("medianPts & findDualPoints took " + (t3 - t2) + " milliseconds.")  
  
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


function findDualPoints(medianPts, spacing, anglePrefix, offset) {
    
  let dualPts = [];
    
  for (let pt of medianPts) {
    let xd = 0;
    let yd = 0;

    for (let i=0; i<5; i++) {
      let k = floor((pt.x/spacing) * cosTable[i] + (pt.y/spacing) * sinTable[i] - offset[i]);
      xd += spacing * k * cosTable[i]/1.06;
      yd += spacing * k * sinTable[i]/1.06;
    }

    dualPts.push({
      x: xd, 
      y: yd
    });
  }

  let dMax = dualPts.length;
      
  // compute area using determinant method
  let area = 0;
  for (let i=0; i<dMax; i++) {
    area += 0.5 * (dualPts[i].x * dualPts[(i+1)%dMax].y - dualPts[i].y * dualPts[(i+1)%dMax].x)
  }

  area = round(area);

  if (!shapes.includes(area)) {
    shapes.push(area);
  }

  let i = shapes.indexOf(area);
  fill(colors[i]);
  

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

function findIntersections(grid, spacing) {
   
  let pts = {};
  //let angle1 = grid[20][0];
  //let index1 = grid[20][1];
  
  for (let [angle1, index1] of grid) {
    for (let [angle2, index2] of grid) {
      if (angle1 !== angle2 && index1 <= 15*spacing  && index1 >= -15*spacing) {
        let s1 = sin(angle1);
        let s2 = sin(angle2);
        let c1 = cos(angle1);
        let c2 = cos(angle2);
        let s12 = sin(angle1-angle2);
        let s21 = sin(angle2-angle1);

        let x = (index2 * s1 - index1 * s2)/s12;
        let y = (index2 * c1 - index1 * c2)/s21;
        
        let yprime = x * sin(-angle1) + y * cos(-angle1);
        
        if (yprime <= 15*spacing && yprime >= -15*spacing) {
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