# Arcus

Server-sent events (SSE) module for NodeJS.


## Installation

Because this package is not in npmjs.org yet, it needs to be installed from this Github repo:

```bash
$ npm install --save arnellebalane/arcus
```


## API

**`arcus`** inherits the prototype of [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter).

- **`connect(req, res) => id`**: Enable Server-Sent Events (SSEs) on the given connection.
  - `req`: an `http.IncomingMessage` instance
  - `res`: an `http.ServerResponse` instance
  - returns an `id`, which is a uuid that identifies the connection

- **`disconnect(id)`**: Send the `disconnect` event to the SSE client identified by the given `id` and then forget about it.
  - `id`: The uuid of the SSE connection to be disconnected

- **`send(id, options={})`**: Send data to an SSE client identified by the given uuid.
  - `id`: The uuid of the SSE client to send the data to.
  - `options.event`: The name for the server-sent event. Specifying this option will trigger the client-side EventSource's event listeners for the event of the same name, otherwise the `message` event.
  - `options.data`: The data that will be sent to the SSE client, and can be obtained from "e.data" in the client-side callbacks.

- **`event: 'connect'`**: Emitted after successful `connect()` operation. Callback function receives the following arguments:
  - `id`: The uuid that identifies the new SSE connection

- **`event: 'disconnect'`**: Emitted after successful `disconnect()` operation. Callback function receives the following arguments:
  - `id`: The uuid of the SSE connection that got disconnected

- **`event: 'send'`**: Emitted after successful `send()` operation. Callback function receives the following arguments:
  - `id`: The uuid of the SSE connection where the data was sent to.
  - `options`: Same options object that got passed to the `send` function.


## Usage Example

```js
const arcus = require('arcus');

arcus.on('connect', (id) => {
    console.log(`Client "${id}" is now connected.`);
    arcus.send(id, 'You are now connected to Arcus!');
});

app.get('/stream', (req, res) => arcus.connect(req, res));
```


## License

MIT License
