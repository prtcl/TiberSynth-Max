const { rand } = require('plonk');
const createStore = require('./lib/createStore');
const { createSpace, updateSpace, randomizeSpace } = require('./lib/space');
const { createHistory, isAtEnd, pop, undo, redo } = require('./lib/history');

const FREQ_SIZES = [0, 4, 4];
const N_GAIN = 5;
const N_BUTTONS = 6;
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
  randomize ({
    freqs,
    histories,
    positions,
    spaces
  }, values) {
    const up = values.slice(0, N_BUTTONS);
    const down = values.slice(N_BUTTONS, N_BUTTONS * 2);
    spaces.forEach((space, i) => {
      const shouldGoUp = up[i];
      const shouldGoDown = down[i];
      const history = histories[i];
      if (shouldGoUp) {
        if (isAtEnd(history)) {
          const pos = positions[i];
          const freq = freqs[i];
          randomizeFreqs(freq);
          randomizeSpace(space);
          updateSpace(space, pos);
          pop(history, { freq, space });
        } else {
          const { freq: newFreqs, space: newSpace } = redo(history);
          freqs[i] = newFreqs;
          spaces[i] = newSpace;
        }
      } else if (shouldGoDown) {
        const { freq: oldFreqs, space: oldSpace } = undo(history);
        freqs[i] = oldFreqs;
        spaces[i] = oldSpace;
      }
    });
  },
  everyone ({
    freqs,
    histories,
    positions,
    spaces
  }, values) {
    const shouldGoUp = values[0];
    const shouldGoDown = values[1];
    if (shouldGoUp) {
      spaces.forEach((space, i) => {
        const history = histories[i];
        if (isAtEnd(history)) {
          const pos = positions[i];
          const freq = freqs[i];
          randomizeFreqs(freq);
          randomizeSpace(space);
          updateSpace(space, pos);
          pop(history, { freq, space });
        } else {
          const { freq: newFreqs, space: newSpace } = redo(history);
          freqs[i] = newFreqs;
          spaces[i] = newSpace;
        }
      });
    } else if (shouldGoDown) {
      spaces.forEach((s, i) => {
        const history = histories[i];
        const { freq: oldFreqs, space: oldSpace } = undo(history);
        freqs[i] = oldFreqs;
        spaces[i] = oldSpace;
      });
    }
  }
}, {
  freqs: FREQ_SIZES.map((n) => new Array(n).fill(0)),
  gain: new Array(N_GAIN).fill(0),
  histories: new Array(N_SPACES).fill(null).map(createHistory),
  positions: new Array(N_SPACES).fill(null).map(() => ({ x: 0, y: 0 })),
  spaces: SPACE_SIZES.map(createSpace)
});
