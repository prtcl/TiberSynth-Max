const { rand } = require('plonk');
const createStore = require('./lib/createStore');
const { createSpace, updateSpace, randomizeSpace } = require('./lib/space');
const { createHistory, isAtEnd, pop, undo, redo } = require('./lib/history');

const FREQ_SIZES = [0, 4, 4, 0];
const N_GAIN = 5;
const N_BUTTONS = 6;
const SPACE_SIZES = [8, 12, 12, 12];
const N_SPACES = SPACE_SIZES.length;

const randomizeFreqs = (freqs) => {
  freqs.forEach((f, i) => {
    freqs[i] = rand(0, 1);
  });
};

const randomizeAndUpdateAndPop = (
  freq,
  space,
  pos,
  history
) => {
  randomizeFreqs(freq);
  randomizeSpace(space);
  updateSpace(space, pos);
  pop(history, { freq, space });
};

const goUp = (
  freqs,
  spaces,
  index,
  history
) => {
  const { freq: newFreqs, space: newSpace } = redo(history);
  freqs[index] = newFreqs;
  spaces[index] = newSpace;
};

const goDown = (
  freqs,
  spaces,
  index,
  history
) => {
  const { freq: oldFreqs, space: oldSpace } = undo(history);
  freqs[index] = oldFreqs;
  spaces[index] = oldSpace;
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
          randomizeAndUpdateAndPop(
            freqs[i],
            space,
            positions[i],
            history
          );
        } else {
          goUp(freqs, spaces, i, history);
        }
      } else if (shouldGoDown) {
        goDown(freqs, spaces, i, history);
      }
    });
  },
  everyone ({
    freqs,
    histories,
    positions,
    spaces
  }, values) {
    const [shouldGoUp, shouldGoDown] = values;
    spaces.forEach((space, i) => {
      const history = histories[i];
      if (shouldGoUp) {
        if (isAtEnd(history)) {
          randomizeAndUpdateAndPop(
            freqs[i],
            space,
            positions[i],
            history
          );
        } else {
          goUp(freqs, spaces, i, history);
        }
      } else if (shouldGoDown) {
        goDown(freqs, spaces, i, history);
      }
    });
  },
  setFilter ({ filter }, values) {
    values.forEach((value, i) => {
      filter[i] = value;
    });
  }
}, {
  filter: [0, 1],
  freqs: FREQ_SIZES.map((n) => new Array(n).fill(0)),
  gain: new Array(N_GAIN).fill(0),
  histories: new Array(N_SPACES).fill(null).map(createHistory),
  positions: new Array(N_SPACES).fill(null).map(() => ({ x: 0, y: 0 })),
  spaces: SPACE_SIZES.map(createSpace)
});
