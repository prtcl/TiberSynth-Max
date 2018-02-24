const { cloneDeep } = require('lodash');
const { clamp } = require('plonk');

const createHistory = () => ({
  index: -1,
  stack: []
});

const isAtEnd = ({ index, stack }) => index === stack.length - 1;

const getCurrent = ({ index, stack }) => {
  return stack[index];
};

const undo = (history) => {
  history.index = clamp(history.index - 1, 0, history.stack.length - 1);
  return getCurrent(history);
};

const redo = (history) => {
  history.index = clamp(history.index + 1, 0, history.stack.length - 1);
  return getCurrent(history);
};

const pop = (history, obj) => {
  history.stack.push(cloneDeep(obj));
  history.index = history.stack.length - 1;
};

module.exports = {
  createHistory,
  getCurrent,
  isAtEnd,
  pop,
  redo,
  undo
};
