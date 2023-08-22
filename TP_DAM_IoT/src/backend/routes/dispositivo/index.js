const express = require('express')
const routerDispositivo = express.Router()
var pool = require('../../mysql-connector');

routerDispositivo.get('/', function(req, res) {
    pool.query('Select * from Dispositivos', function(err, result, fields) {
        if (err) {
            res.send(err).status(400);
            return;
        }
        res.send(result);
    });
})

routerDispositivo.get('/:id', function(req, res) {
    let deviceID = req.params.id;
    let query = 'SELECT * FROM Dispositivos WHERE dispositivoId =?';
    pool.query(query, [deviceID], (err, data) => {
        if (err) {
            console.error(err);
            res.send(("Error").status(400))
            return;
        }
        console.log(data[0]);
        res.send(JSON.stringify(data[0])).status(200);
    });
 });

module.exports = routerDispositivo