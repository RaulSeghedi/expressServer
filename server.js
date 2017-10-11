'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    next();
});

let index = 1;

// Get data from list
app.get('/', (request, response) => {
    fs.readFile('data.json', function read(err, data) {
        if (err) {
            throw err;
        }
        let list = JSON.parse(data);
        response.send(list);
    })
});

// Add data
app.post('/', (request, response) => {
    console.log('Request received');
    fs.readFile('data.json', function read(err, data) {
        if (err) {
            throw err;
        }
        let list = JSON.parse(data);
        let obj = request.body;
        obj.id = index;
        index += 1;
        list.push(obj);
        fs.writeFile('data.json', JSON.stringify(list), (err) => {
            if (err) throw err;
            console.log('File written to json file');
            response.send(obj);
        })
    })
});

// Delete data
app.delete('/:id', (request, response) => {
    fs.readFile('data.json', function read(err, data) {
        if (err) {
            throw err;
        }
        let id = request.params.id;
        let list = JSON.parse(data);
        list = list.filter(obj => obj.id != id);
        fs.writeFile('data.json', JSON.stringify(list), (err) => {
            if (err) throw err;
            console.log('File deleted from data.json');
            response.send(id)
        });
    })
});

//client: http.put( http://localhost:3000/1, body = {id:1,...} )
//server:

app.put('/:id', (request, response) => {
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        let id = request.params.id;
        let list = JSON.parse(data);
        let updated;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                list[i] = request.body;
                updated = list[i];
            }
        }
        fs.writeFile('data.json', JSON.stringify(list), (err) => {
            if (err) throw err;
            console.log('File updated');
            response.send(updated);
        })
    })
});


// Erase the entire list
app.get('/erase', (request, response) => {
    fs.writeFile('data.json', '[]', (err) => {
        if (err) throw err;
        console.log('All data deleted from data.json');
        response.send({message:"ok"})
    });
});


//client: http:localhost:3000/sorted/asc


app.get('/sorted/:sortedType', (request, response) => {
    fs.readFile('data.json', function read(err, data) {
        if (err) {
            throw err;
        }
        let list = JSON.parse(data);
        let sType = request.params.sortedType;
        if (sType == 'asc') {
            list.sort((a, b) => {
                if (a.name < b.name) return -1;
                else if (a.name > b.name) return 1;
                else return 0;
            });
        } else if (sType == 'desc') {
            list.sort((a, b) => {
                if (a.name > b.name) return -1;
                else if (a.name < b.name) return 1;
                else return 0;
            });
        }
        console.log("sorted list", list);
        response.send(list);
    })

});
/*
app.get('/:id', (request, response) => {
    fs.readFile('data.json', function read(err, data) {
        if (err) throw err;
        let id = request.params.id;
        let list = JSON.parse(data);
        let found;
        for (let i = 0; i < list.length; i++){
            if (list[i].id == id) {
                found = list[i];
            }
        }
        response.send(found);
    })
});
*/
app.listen(3000, ()=> {
    console.log('Listening on port 3000. Post a file to http://localhost:3000 to save to /data.json');
});