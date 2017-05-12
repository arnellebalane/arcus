const uuid = require('uuid');

const clients = {};

/**
 *  Enable Server-Sent Events (SSEs) on the given connection. All active SSE
 *  connections are going to be kept track, identified by a uuid, so that data
 *  can be sent to them at a later time.
 *  @param {http.IncomingMessage} req
 *  @param {http.ServerResponse} res
 **/
function connect(req, res) {
    const id = uuid();
    clients[id] = { req, res };
    res.setHeader('Content-Type', 'text/event-stream');
    send(id, { event: 'connect', data: id });

    req.on('close', () => disconnect(id));
    return id;
}

/**
 *  Send data to an SSE client identified by the given uuid.
 *  @param {String} id - The uuid of the SSE client to send the data to.
 *  @param {Object} options - Describes properties of the server-sent event.
 *  @param {String} [options.event] - The name for the server-sent event.
 *      Specifying this option will trigger the client-side EventSource's event
 *      listeners for the event of the same name, otherwise the "message" event.
 *  @param {String} options.data - The data that will be sent to the SSE
 *      client, and can be obtained from "e.data" in the client-side callbacks.
 *  Learn more about the event stream format over at this MDN page:
 *  https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format
 **/
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
