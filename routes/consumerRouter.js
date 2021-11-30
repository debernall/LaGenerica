const express = require('express');
const bodyParser = require('body-parser');

const consumerRouter = express.Router();

consumerRouter.use(bodyParser.json());

consumerRouter.route('/')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Enviaremos todos los clientes para ti');
})
.post((req,res,next) => {
    res.end('Añadiremos tus clientes: '+ req.body.name + 
    ' con detalles: '+ req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /consumers');
})
.delete((req,res,next) => {
    res.end('Borraremos todos los clientes para ti!!');
});

consumerRouter.route('/:consumerId')
.get((req,res,next) => {
    res.end('Te enviaré detalles del cliente' + req.params.consumerId + 'para ti');
})
.post((req,res,next) => {
    res.end('POST operation is not allowed on /consumers/' + req.params.consumerId);
})
.put((req,res,next) => {
    res.write('Updating the consumer: ' + req.params.consumerId + '\n');
    res.end('Actualizaré el cliente: '+ req.body.name +
    'con detalles '+ req.body.description);
})
.delete((req,res,next) => {
    res.end('Borrando el cliente '+ req.body.name);
})

module.exports = consumerRouter;