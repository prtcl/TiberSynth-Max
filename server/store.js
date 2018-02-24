const { rand } = require('plonk');
const createStore = require('./lib/createStore');
const { createSpace, updateSpace, randomizeSpace } = require('./lib/space');

const FREQ_SIZES = [0, 4, 4];
const N_GAIN = 5;
const SPACE_SIZES = [8, 12, 12];
const N_SPACES = SPACE_SIZES.length;

const randomizeFreqs = (freqs) => {
  for (let i = 0; i < freqs.length; i++) {
    freqs[i] = rand(0, 1);
  }
};

module.exports = createStore({
  setGain ({ gain }, values) {
    values.forEach((v, i) => {
      gain[i] = v;
    });
  },
  setX ({ positions, spaces }, values) {
    spaces.forEach((space, i) => {
      const x = values[i];
      const pos = positions[i];
      if (pos.x === x) {
        return;
      }
      pos.x = x;
      updateSpace(space, pos);
    });
  },
  setY ({ positions, spaces }, values) {
    spaces.forEach((space, i) => {
      const y = values[i];
      const pos = positions[i];
      if (pos.y === y) {
        return;
      }
      pos.y = y;
      updateSpace(space, pos);
    });
  },
  randomize ({ freq, positions, spaces }, values) {
    console.log(values);
    // freq.forEach((f, i) => {
    //   freq[i] = rand(0, 1);
    // });
    // spaces.forEach((space, i) => {
    //   const pos = positions[i];
    //   randomizeSpace(space);
    //   updateSpace(space, pos);
    // });
  },
  everyone ({ freqs, positions, spaces }, values) {
    console.log(values);
    if (values[0] === 1) {
      spaces.forEach((space, i) => {
        const pos = positions[i];
        const freq = freqs[i];
        randomizeFreqs(freq);
        randomizeSpace(space);
        updateSpace(space, pos);
      });
    }
  }
}, {
  freqs: FREQ_SIZES.map((n) => new Array(n).fill(0)),
  gain: new Array(N_GAIN).fill(0),
  positions: new Array(N_SPACES).fill(null).map(() => ({ x: 0, y: 0 })),
  spaces: SPACE_SIZES.map(createSpace)
});
