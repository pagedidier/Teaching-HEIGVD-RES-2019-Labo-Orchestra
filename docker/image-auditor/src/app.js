const dgram = require('dgram');
const net = require('net');
const moment = require('moment');
const protocol = require('./protocol');

moment().format();

function Musicians() {
  this.list = [];

  Musicians.prototype.Add = (param) => {
    const index = this.list.findIndex(musician => musician.uuid === param.uuid);
    if (index === -1) {
      this.list.push(param);
    } else {
      this.list[index].activeSince = param.activeSince;
    }
  };

  Musicians.prototype.update = () => {
    this.list = this.list.filter(musician => moment(Date.now()).diff(musician.activeSince, 'second') <= 5);
  };
}

const socket = dgram.createSocket('udp4');
const musician = new Musicians();


socket.bind(protocol.PROTOCOL_PORT, () => {
  console.log('Joining multicast group');
  socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

socket.on('message', (msg, source) => {
  const data = JSON.parse(msg.toString());

  const { instrument } = protocol.PROTOCOL_INSTRUMENT.find(sound => sound.sound === data.sound);
  const musicianObject = {
    uuid: data.uuid,
    instrument,
    activeSince: new Date(Date.now()),
  };
  musician.Add(musicianObject);
  musician.update();
});

const server = net.createServer();
server.listen(protocol.PROTOCOL_PORT, () => {
  console.log(`TCP Server is running on port ${protocol.PROTOCOL_PORT}.`);
});
server.on('connection', (sock) => {
  sock.write(JSON.stringify(musician.list));
  sock.end();
});
