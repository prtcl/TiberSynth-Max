const { clamp, rand } = require('plonk');

const calculateDistance = (x1 = 0, y1 = 0, x2 = 0, y2 = 0) => {
  var d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2.01;
  return clamp(d, 0, 1) * -1 + 1;
};

const createPoint = () => ({ x: 0, y: 0, weight: 0 });

module.exports = class Space {
  constructor (nPoints = 0) {
    this.position = { x: 0, y: 0 };
    this.points = new Array(nPoints)
      .fill(null)
      .map(createPoint);
    this.values = new Array(nPoints).fill(0);
  }

  move (x, y) {
    this.position.x = x;
    this.position.y = y;
    let i = -1;
    const len = this.points.length;
    while (++i < len) {
      const p = this.points[i];
      const distance = calculateDistance(x, y, p.x, p.y);
      this.values[i] = p.weight * distance;
    }
  }

  randomize () {
    let i = -1;
    const len = this.points.length;
    while (++i < len) {
      const p = this.points[i];
      p.x = rand(-1, 1);
      p.y = rand(-1, 1);
      p.weight = rand(0, 1);
    }
  }

  getValues () {
    return this.values;
  }
};
