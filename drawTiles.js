// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name
    // p5 sketch goes here
    let canvas;
    let preFactor;
    let rotate;

    let selectedTile = {};
    let recentHover = true;
    let recentlySelectedTiles = [];
    let adding = true;

    let mouseIsPressed = false;
    let prevX = 0;
    let prevY = 0;

    p.setup = function() {

      let target = parent.$el.parentElement;
      let width = target.clientWidth;
      let height = target.clientHeight;

      canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
      window.addEventListener('mousemove', mouseMoved);
      parent.$emit('update:resize-completed'); 

      p.noLoop();
      drawTiles(parent.data);
    };

    p.draw = function() {

    };

    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(data, oldData) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
      if (data.display == 'none') {
        // measure parent without canvas
        let target = parent.$el.parentElement;
        let width = target.clientWidth;
        let height = target.clientHeight;

        // resize canvas
        p.resizeCanvas(width, height);
        parent.$emit('update:resize-completed'); 
      }

      drawTiles(data);
    };

    function whichSide(xp, yp, x1, y1, x2, y2) {
      return Math.sign((yp - y1) * (x2 -x1) - (xp - x1) * (y2 - y1));
    }

    function tileToString(tile) {
      return JSON.stringify({
        x: tile.x,
        y: tile.y
      });
    }

    function mouseMoved(mousePos) {

      if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
        recentHover = true;

        let xprime = (p.mouseX - p.width/2) * Math.cos(-rotate) - (p.mouseY - p.height/2) * Math.sin(-rotate) + p.width/2;
        let yprime = (p.mouseX - p.width/2) * Math.sin(-rotate) + (p.mouseY - p.height/2) * Math.cos(-rotate) + p.height/2;

        selectedTile = getSelectedTile(xprime, yprime);

        drawTiles(parent.data);

        if (Object.keys(selectedTile).length > 0) {

          if (mouseIsPressed) {

            let tileString = tileToString(selectedTile);
            if (!recentlySelectedTiles.includes(tileString)) {
              updateSelectedTiles(selectedTile, adding);
              recentlySelectedTiles.push(tileString);
            }            

            let mouseDistance = p.dist(p.mouseX, p.mouseY, prevX, prevY);
            let stepSize = p.max(1, preFactor/10);

            if (mouseDistance > stepSize) {
              for (let i = 0; i <= mouseDistance; i += stepSize) {
                let cursorX = p.map(i, 0, mouseDistance, p.mouseX, prevX, true);
                let cursorY = p.map(i, 0, mouseDistance, p.mouseY, prevY, true);

                let xprime = (cursorX - p.width/2) * Math.cos(-rotate) - (cursorY - p.height/2) * Math.sin(-rotate) + p.width/2;
                let yprime = (cursorX - p.width/2) * Math.sin(-rotate) + (cursorY - p.height/2) * Math.cos(-rotate) + p.height/2;
                let intermediateTile = getSelectedTile(xprime, yprime);

                if (Object.keys(intermediateTile).length > 0) {
                  let tileString = tileToString(intermediateTile);
                  if (!recentlySelectedTiles.includes(tileString)) {
                    updateSelectedTiles(intermediateTile, adding);
                    recentlySelectedTiles.push(tileString);
                  }            
                }
              }
            }
          } else {
            p.push();
              p.translate(p.width/2, p.height/2);
              p.fill(128, 215, 255);
              p.rotate(rotate);
              p.beginShape();
              for (let pt of selectedTile.dualPts) {
                p.vertex(preFactor * pt.x, preFactor * pt.y);
              }
              p.endShape(p.CLOSE);
            p.pop();
          }

        } 

        prevX = p.mouseX;
        prevY = p.mouseY;

      } else if (recentHover) {
        recentHover = false;
        drawTiles(parent.data);
      }

    }


    p.mousePressed = function() {

      if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
        let xprime = (p.mouseX - p.width/2) * Math.cos(-rotate) - (p.mouseY - p.height/2) * Math.sin(-rotate) + p.width/2;
        let yprime = (p.mouseX - p.width/2) * Math.sin(-rotate) + (p.mouseY - p.height/2) * Math.cos(-rotate) + p.height/2;

        selectedTile = getSelectedTile(xprime, yprime);

        if (Object.keys(selectedTile).length > 0) {

          let tileString = tileToString(selectedTile);

          if (!recentlySelectedTiles.includes(tileString)) {
            let index = parent.data.selectedTiles.findIndex(e => e.x == selectedTile.x && e.y == selectedTile.y);
            adding = index < 0;
            updateSelectedTiles(selectedTile, adding);
            recentlySelectedTiles.push(tileString);
          }            

        } 
  
        mouseIsPressed = true;
        prevX = p.mouseX;
        prevY = p.mouseY;

      }

    };

    p.mouseReleased = function() {
      recentlySelectedTiles = [];
      mouseIsPressed = false;
    };


    function getSelectedTile(mouseX, mouseY) {
      let x = (mouseX - p.width/2)/preFactor;
      let y = (mouseY - p.height/2)/preFactor;

      let inside = false;
      let mySelectedTile = {};

      let nearbyTiles = Object.values(parent.data.tiles).filter(e => p.dist(x, y, e.dualPts[0].x, e.dualPts[0].y) < 2);
      for (let tile of nearbyTiles) {

        if (!inside) {
          let vertices = tile.dualPts;
          let numVertices = vertices.length;

          let a = whichSide(x, y, vertices[0].x, vertices[0].y, vertices[1].x, vertices[1].y);
          inside = true;

          for (let i = 1; i < numVertices; i++) {
            if (a !== whichSide(x, y, vertices[i].x, vertices[i].y, vertices[(i + 1) % numVertices].x, vertices[(i + 1) % numVertices].y)) {
              inside = false;
            }
          }

          if (inside) {
            mySelectedTile = tile;
          }
        }
      }

      return mySelectedTile;

    }

    function updateSelectedTiles(tile, addMode) {

      if (addMode) {
        parent.$emit('update:add-tile', tile);
      } else {
        parent.$emit('update:remove-tile', tile); 
      }

    }

    function drawTiles(data) {
      let steps = data.steps;
      let multiplier = data.multiplier;
      let spacing = p.min(p.width, p.height) / (steps);
      preFactor = spacing * data.multiplier / Math.PI;
      preFactor = preFactor * data.zoom;
      let stroke = data.stroke;
      rotate = p.radians(data.rotate);

      let onScreenColors = data.colors.filter(e => e.onScreen && e.symmetry == data.symmetry);

      p.push();
      p.background(0, 0, 0.2 * 255);
      p.translate(p.width / 2, p.height / 2);
      p.rotate(rotate);

      for (let tile of Object.values(data.tiles)) {

        let tileIsSelected = false;
        if (data.selectedTiles.length > 0) {
          tileIsSelected = data.selectedTiles.filter(e => e.x == tile.x && e.y == tile.y).length > 0;
        }

        let tileInSelectedLine = false;
        let numLinesPassingThroughTile = 0;

        if (data.selectedLines.length > 0) {
          for (let l of tile.lines) {
            if (data.selectedLines.filter(e => e.angle == l.angle && e.index == l.index).length > 0) {
              tileInSelectedLine = true;
              numLinesPassingThroughTile++;
            }
          }
        }

        if (data.colorTiles) {
          let color = onScreenColors.filter(e => e.area == tile.area && (data.orientationColoring ? JSON.stringify(e.angles) == JSON.stringify(tile.angles) : true))[0];

          p.fill(color.fill);
          p.stroke(stroke, stroke, stroke);

          if (tileInSelectedLine) {
            p.fill(0, 255, 0);
            if (numLinesPassingThroughTile > 1) {
              p.fill(60, 179, 113);
            }
          }
          if (tileIsSelected) {
            p.fill(128, 215, 255);
          }

        } else {
          p.stroke(0, 255, 0);
          p.noFill();

          if (tileInSelectedLine) {
            p.fill(0, 255, 0, 150);
            if (numLinesPassingThroughTile > 1) {
              p.fill(60, 179, 113, 150);
            }
          }
          if (tileIsSelected) {
            p.fill(110, 110, 255);
          }

        }

        p.beginShape();
        for (let pt of tile.dualPts) {
          p.vertex(preFactor * pt.x, preFactor * pt.y);
        }
        p.endShape(p.CLOSE);
      }

      p.pop();
    }

  };
}