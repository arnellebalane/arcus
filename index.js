const uuid = require('uuid');

const clients = {};

function connect(req, res) {
    const id = uuid();
    clients[id] = { req, res };
    res.setHeader('Content-Type', 'text/event-stream');
    send(id, { event: 'connect', data: 'you are now connected to arcus' });
    return id;
}

function send(id, options={}) {
    const res = clients[id].res;
    const data = Object.keys(options)
        .map((key) => `${key}: ${options[key]}`)
        .join('\n');
    res.write(data + '\n\n');
}

module.exports = { connect, send };
