const { EventEmitter } = require('events');

const createStore = (actions, state) => {
  const events = new EventEmitter();
  const update = () => events.emit('update', state);
  const dispatch = (action, args) => {
    const res = action(state, args);
    update();
    return res;
  };
  return {
    ...Object.keys(actions)
      .reduce((res, name) => ({
        ...res,
        [name]: (args) => dispatch(actions[name], args)
      }), {}),
    subscribe (listener) {
      events.on('update', listener);
    }
  };
};

module.exports = createStore;
