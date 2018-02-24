const { rand } = require('plonk');
const createStore = require('./lib/createStore');
const { createSpace, updateSpace, randomizeSpace } = require('./lib/space');

module.exports = createStore({
  setGain ({ gain }, values) {
    values.forEach((v, i) => {
      gain[i] = v;
    });
  },
  setX ({ spaces }, values) {
    spaces.forEach((space, i) => {
      const x = values[i];
      if (space.position.x === x) {
        return;
      }
      space.position.x = x;
      updateSpace(space);
    });
  },
  setY ({ spaces }, values) {
    spaces.forEach((space, i) => {
      const y = values[i];
      if (space.position.y === y) {
        return;
      }
      space.position.y = y;
      updateSpace(space);
    });
  },
  randomize ({ freq, spaces }) {
    freq.forEach((f, i) => {
      freq[i] = rand(0, 1);
    });
    spaces.forEach((space) => {
      randomizeSpace(space);
      updateSpace(space);
    });
  }
}, {
  gain: new Array(5).fill(0),
  freq: new Array(8).fill(0),
  spaces: [8, 12, 12].map(createSpace)
});
