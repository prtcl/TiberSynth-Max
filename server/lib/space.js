const { clamp, rand } = require('plonk');

const calculateDistance = (x1 = 0, y1 = 0, x2 = 0, y2 = 0) => {
  var d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2.01;
  return clamp(d, 0, 1) * -1 + 1;
};

const createPoint = () => ({ x: 0, y: 0, weight: 0 });

const createSpace = (nPoints = 0) => ({
  position: { x: 0, y: 0 },
  points: new Array(nPoints)
    .fill(null)
    .map(createPoint),
  values: new Array(nPoints).fill(0)
});

const updateSpace = ({
  points,
  position: { x, y },
  values
}) => {
  const len = points.length;
  let i = -1;
  while (++i < len) {
    const p = points[i];
    const distance = calculateDistance(x, y, p.x, p.y);
    values[i] = p.weight * distance;
  }
};

const randomizeSpace = ({ points }) => {
  let i = -1;
  const len = points.length;
  while (++i < len) {
    const p = points[i];
    p.x = rand(0, 1);
    p.y = rand(0, 1);
    p.weight = rand(0, 1);
  }
};

module.exports = {
  createSpace,
  updateSpace,
  randomizeSpace
};
