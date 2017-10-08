'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
});

app.get('/', (request, response) => {
    fs.readFile('data.json', function read(err, data) {
        if (err) {
            throw err;
        }
        let list = JSON.parse(data);
        response.send(list);
    })
});

app.listen(3000, ()=> {
    console.log('Listening on port 3000. Post a file to http://localhost:3000 to save to /data.json');
});