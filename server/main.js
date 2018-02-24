const osc = require('osc');
const store = require('./store');
const PORT = parseInt(process.env.PORT);
const INCOMING_PORT = PORT;
const OUTGOING_PORT = PORT + 1;

const port = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: INCOMING_PORT,
  remoteAddress: '127.0.0.1',
  remotePort: OUTGOING_PORT
});

const routes = {
  ['/Gain/x']: (args) => store.setGain(args),
  ['/Space/x']: (args) => store.setX(args),
  ['/Space/y']: (args) => store.setY(args),
  ['/Randomize/x']: (args) => {
    if (!args.find((v) => v === 1)) {
      return;
    }
    store.randomize(args);
  },
  ['/Everyone/x']: (args) => {
    if (!args.find((v) => v === 1)) {
      return;
    }
    store.everyone(args);
  }
};

port.on('ready', () => {
  store.subscribe((state) => {
    port.send({
      address: '/gain',
      args: state.gain
    });
    state.freqs.forEach((freqs, i) => {
      port.send({
        address: `/freqs/${i}`,
        args: freqs
      });
    });
    state.spaces.forEach((s, i) => {
      port.send({
        address: `/space/${i}`,
        args: s.values
      });
    });
    console.log(state);
  });
  store.everyone([1]);
});

port.on('message', ({ address, args }) => {
  const handler = routes[address];
  if (handler) {
    handler(args);
  }
});

port.open();
