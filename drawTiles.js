// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name
    // p5 sketch goes here
    let canvas;
    let preFactor;
    let selectedTile = {};
    let recentHover = true;

    p.setup = function() {

      let target = parent.$el.parentElement;
      let width = target.clientWidth;
      let height = target.clientHeight;

      canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);
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

    p.mouseMoved = function() {

      if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
        recentHover = true;
        selectedTile = getSelectedTile(p.mouseX, p.mouseY);
      } else if (recentHover) {
        recentHover = false;
        selectedTile = {};
      } 

      drawTiles(parent.data);

      if (Object.keys(selectedTile).length > 0) {
        p.push();
          p.translate(p.width/2, p.height/2);
          p.fill(0, 255, 0);
          p.beginShape();
          for (let pt of selectedTile.dualPts) {
            p.vertex(preFactor * pt.x, preFactor * pt.y);
          }
          p.endShape(p.CLOSE);
        p.pop();
      } 

    };

    p.mouseClicked = function() {
      if (Object.keys(selectedTile).length > 0) {
        updateSelectedTiles(selectedTile);
      }
    };

    function getSelectedTile(mouseX, mouseY) {
      let x = (mouseX - p.width/2)/preFactor;
      let y = (mouseY - p.height/2)/preFactor;

      let inside = false;
      let mySelectedTile = {};

      for (let tile of Object.values(parent.data.tiles)) {

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

    function updateSelectedTiles(tile) {

      let index = parent.data.selectedTiles.findIndex(e => e.x == tile.x && e.y == tile.y);

      if (index < 0) {
        let selectedTiles = [...parent.data.selectedTiles];
        selectedTiles.push(tile);
        parent.$emit('update:selected-tiles', selectedTiles); 
      } else {
        let selectedTiles = parent.data.selectedTiles.filter((e,i) => i !== index);
        parent.$emit('update:selected-tiles', selectedTiles); 
      }

    }

    function drawTiles(data) {
      let steps = data.steps;
      let multiplier = data.multiplier;
      let spacing = p.min(p.width, p.height) / (steps);
      preFactor = spacing * data.multiplier / Math.PI;
      preFactor = preFactor * data.zoom;

      p.push();
      p.background(0, 0, 0.2 * 255);
      p.translate(p.width / 2, p.height / 2);

      for (let tile of Object.values(data.tiles)) {

        let selected = false;
        for (let l of tile.lines) {
          if (data.selectedLines.filter(e => e[0] == l[0] && e[1] == l[1]).length > 0) {
            selected = true;
          }
        }

        if (data.colorTiles) {
          let color = data.colors[tile.area].color;
          p.fill(p.color(...color));

          let stroke = data.colors[tile.area].stroke;
          p.stroke(p.color(...stroke));

          if (selected || data.selectedTiles.filter(e => e.x == tile.x && e.y == tile.y).length > 0) {
            p.fill(0, 255, 0);
          } 

        } else {
          p.stroke(0, 255, 0);
          p.noFill();

          if (selected || data.selectedTiles.filter(e => e.x == tile.x && e.y == tile.y).length > 0) {
            p.fill(0, 255, 0, 150);
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