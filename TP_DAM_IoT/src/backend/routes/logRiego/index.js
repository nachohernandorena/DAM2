const express = require('express')
const routerLogRiego = express.Router()
var pool = require('../../mysql-connector');

//obtener un registro en la tabla de Log_Riegos
routerLogRiego.get('/:id/all', function (req, res) {
    let electrovalvulaId = req.params.id;
    let query = 'Select * from Log_Riegos where electrovalvulaId=? order by fecha desc';
    pool.query(query, [electrovalvulaId], (err, data) => {
        if (err) {
            console.error(err);
            res.send(("Error" + electrovalvulaId ).status(400))
            return;
        }
        console.log(data[0]);
        res.send(JSON.stringify(data[0])).status(200);
    });
});


//insertar un registro en la tabla de Log_Riegos
routerLogRiego.post('/add', function(req, res, next) {
    pool.query('INSERT INTO `Log_Riegos` (`apertura`, `fecha`, `electrovalvulaId`) VALUES (?, ?, ?)',
        [req.body.apertura, req.body.fecha, req.body.electrovalvulaId],
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send({ 'id': rta.insertId }).status(201);
        }
    );
});

//log de los riegos para una electroválvula
routerLogRiego.get('/:electrovalvulaId', function(req, res, next) {
    pool.query('SELECT * FROM Log_Riegos WHERE electrovalvulaId = ?',req.params.electrovalvulaId,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta)).status(200);
        }
    );
});


module.exports = routerLogRiego