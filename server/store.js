const createStore = require('./lib/createStore');
const { createSpace, updateSpace, randomizeSpace } = require('./lib/space');

module.exports = createStore({
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
  randomize ({ spaces }) {
    spaces.forEach((space) => {
      randomizeSpace(space);
      updateSpace(space);
    });
  }
}, {
  spaces: [8, 10, 10].map(createSpace)
});
