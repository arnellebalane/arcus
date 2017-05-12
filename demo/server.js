const path = require('path');
const express = require('express');
const morgan = require('morgan');
const arcus = require('arcus');

const app = express();

app.set('views', '.');
app.use(morgan('dev'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './index.html')));

const clients = [];

app.get('/stream', (req, res) => {
    const id = arcus.connect(req, res);
    clients.push(id);
    clients.forEach((client) => {
        arcus.send(client, { event: 'clientsupdate', data: clients.length });
    });
});

app.listen(3000);
