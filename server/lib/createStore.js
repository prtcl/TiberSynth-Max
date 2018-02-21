
const createStore = (actions, state) => {
  const subscribers = [];
  const update = () => {
    subscribers.forEach((fn) => fn(state));
  };
  const dispatch = (action, args) => {
    action(state, args);
    update();
  };

  return {
    ...Object.keys(actions)
      .reduce((res, name) => ({
        ...res,
        [name]: (args) => dispatch(actions[name], args)
      }), {}),
    subscribe (fn) {
      subscribers.push(fn);
    }
  };
};

module.exports = createStore;
