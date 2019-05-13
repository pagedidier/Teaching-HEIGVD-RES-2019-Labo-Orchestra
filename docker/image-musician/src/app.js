
const dgram = require('dgram');

const uuidv1 = require('uuid/v1');

const protocol = require('./protocol');


const s = dgram.createSocket('udp4');

function Musician(instrument, uuid) {
  this.instrument = instrument;

  Musician.prototype.update = function () {
    const data = {
      uuid,
      sound: protocol.PROTOCOL_INSTRUMENT.find(sound => sound.instrument === instrument).sound,
    };

    const payload = JSON.stringify(data);

    const message = Buffer.from(payload);
    s.send(message, 0, message.length, protocol.PROTOCOL_PORT,
      protocol.PROTOCOL_MULTICAST_ADDRESS, (err, bytes) => {
        console.log(`Sending payload: ${payload} via port ${s.address().port}`);
        if (err) {
          console.log(`Error${err}`);
        }
      });
  };
  setInterval(this.update.bind(this), 1000);
}


const instrument = process.argv[2];
const m = new Musician(instrument, uuidv1());
