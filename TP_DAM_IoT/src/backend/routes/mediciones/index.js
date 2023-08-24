const express = require('express')
const routerMediciones = express.Router()
var pool = require('../../mysql-connector');


// Obtener todas la medicion mas reciente de un sensor 
routerMediciones.get('/:id', function(req, res, next) {
    pool.query(
        'SELECT * FROM Mediciones m WHERE m.medicionId = (SELECT MAX(medicionId) FROM Mediciones WHERE dispositivoId = ?)',
        [req.params.id],
        function(err, rta, field) {
            if (err) {
                res.status(400).send(err);
                return;
            }
            res.status(200).send(JSON.stringify(rta));
        }
    );
});


// Asignar medicion a un sensor
routerMediciones.post('/add', function(req, res, next) {
    pool.query('INSERT INTO `Mediciones` (`fecha`, `valor`, `dispositivoId`) VALUES (?, ?, ?)',
        [req.body.fecha, req.body.valor, req.body.dispositivoId],
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send({ 'id': rta.insertId }).status(201);
        }
    );
});

// Obtener todas las mediciones de un sensor
routerMediciones.get('/:id/all', function(req, res, next) {
    pool.query('SELECT * FROM Mediciones WHERE dispositivoId = ?',req.params.id,
        function(err, rta, field) {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.send(JSON.stringify(rta)).status(200);
        }
    );
});



module.exports = routerMediciones