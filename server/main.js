const { drunk, metro, ms } = require('plonk');
const osc = require('osc');
const { UDPPort } = osc;
const Space = require('./Space');
const ENV = process.env.NODE_ENV;
const PORT = parseInt(process.env.PORT);
const INCOMING_PORT = PORT;
const OUTGOING_PORT = PORT + 1;

const port = new UDPPort({
  localAddress: '0.0.0.0',
  localPort: INCOMING_PORT,
  remoteAddress: '127.0.0.1',
  remotePort: OUTGOING_PORT
});

const space = new Space(10);
const xDrunk = drunk(-1, 1, 0.1);
const yDrunk = drunk(-1, 1, 0.1);

port.on('ready', () => {
  metro(ms('10s'), () => {
    space.randomize();
    console.log(space);
    port.send({
      address: '/randomize'
    });
  });

  metro(ms('60fps'), (interval) => {
    space.move(xDrunk(), yDrunk());
    port.send({
      address: '/test',
      args: space.values
    });
  });
});

port.open();
