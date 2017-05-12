const uuid = require('uuid');

const clients = {};

function connect(req, res) {
    const id = uuid();
    clients[id] = { req, res };
    res.setHeader('Content-Type', 'text/event-stream');
    send(id, { event: 'connect', data: id });

    req.on('close', () => disconnect(id));
    return id;
}

function send(id, options={}) {
    const res = clients[id].res;
    const data = Object.keys(options)
        .map((key) => `${key}: ${options[key]}`)
        .join('\n');
    res.write(data + '\n\n');
}

function disconnect(id) {
    delete clients[id];
}

module.exports = { connect, send, disconnect };
