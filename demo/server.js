const path = require('path');
const express = require('express');
const morgan = require('morgan');
const arcus = require('arcus');

const app = express();
const clients = [];

arcus.on('connect', (id) => {
    clients.push(id);
    clients.forEach((client) => {
        arcus.send(client, { event: 'clientsupdate', data: clients.length });
    });
});

arcus.on('disconnect', (id) => {
    const index = clients.indexOf(id);
    clients.splice(index, 1);
    clients.forEach((client) => {
        arcus.send(client, { event: 'clientsupdate', data: clients.length });
    });
});

app.set('views', '.');
app.use(morgan('dev'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './index.html')));
app.get('/stream', arcus.connect);

app.listen(3000);
