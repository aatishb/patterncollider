// this p5 sketch is written in instance mode
// read more here: https://github.com/processing/p5.js/wiki/Global-and-instance-mode

function sketch(parent) { // we pass the sketch data from the parent
  return function( p ) { // p could be any variable name
    // p5 sketch goes here

    p.setup = function() {

      let target = parent.$el;
      let width = target.clientWidth;
      let height = target.clientHeight;

      let canvas = p.createCanvas(width, height);
      canvas.parent(parent.$el);

      p.background(p.random(255), p.random(255), p.random(255));
      p.noLoop();
      //p.noFill();
      //p.stroke(0, 255, 0);
      drawTiles(parent.data);
    };

    p.draw = function() {
    };

    // this is a new function we've added to p5
    // it runs only if the data changes
    p.dataChanged = function(data, oldData) {
      // console.log('data changed');
      // console.log('x: ', val.x, 'y: ', val.y);
      drawTiles(data);
    };


    p.windowResized = function() {
      let target = parent.$el;
      let width = target.clientWidth;
      let height = target.clientHeight;
      p.resizeCanvas(width, height);
      drawTiles(parent.data);
    };

    function drawTiles(data) {
      let tiles = data.tiles;
      let steps = data.steps;
      let multiplier = data.multiplier;
      let spacing = p.min(p.width, p.height) / (2 * steps + 1);
      let preFactor = spacing * data.multiplier / Math.PI;
      preFactor = preFactor / 1.1;

      p.push();
      p.background(0, 0, 0.2 * 255);
      p.translate(p.width / 2, p.height / 2);

      for (let tile of tiles) {
        p.fill(p.color(...tile.color));
        p.stroke(p.color(...tile.stroke));
        p.beginShape();
        for (let pt of tile.points) {
          p.vertex(preFactor * pt.x, preFactor * pt.y);
        }
        p.endShape(p.CLOSE);
      }

      p.pop();
    }

  };
}