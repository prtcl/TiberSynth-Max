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
  ['/Noise1NeuralNetworks/x']: (args) => store.setX(args),
  ['/Noise1NeuralNetworks/y']: (args) => store.setY(args),
  ['/Pads/x']: () => store.randomize()
};

port.on('ready', () => {
  store.subscribe((state) => {
    state.spaces.forEach((s, i) => {
      port.send({
        address: `/space/${i}`,
        args: s.values
      });
    });
  });

  store.randomize();
});

port.on('message', ({ address, args }) => {
  const handler = routes[address];
  if (handler) {
    handler(args);
  }
});

port.open();
