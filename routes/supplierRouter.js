const express = require('express');
const bodyParser = require('body-parser');

const supplierRouter = express.Router();

supplierRouter.use(bodyParser.json());

supplierRouter.route('/')

.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Enviaremos todos los proveedores para ti');
})
.post((req,res,next) => {
    res.end('Añadiremos tus proveedores: '+ req.body.name + 
    ' con detalles: '+ req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /suppliers');
})
.delete((req,res,next) => {
    res.end('Borraremos todos los proveedores para ti!!');
});

supplierRouter.route('/:supplierId')
.get((req,res,next) => {
    res.end('Te enviaré detalles del proveedor' + req.params.name + 'para ti');
})
.post((req,res,next) => {
    res.end('POST operation is not allowed on /supplier/' + req.params.supplierId);
})
.put((req,res,next) => {
    res.write('Updating the supplier: ' + req.params.supplierId + '\n');
    res.end('Actualizaré el proveedor: '+ req.body.name +
    'con detalles '+ req.body.description);
})
.delete((req,res,next) => {
    res.end('Borrando el proveedor '+ req.body.name);
})

module.exports = supplierRouter;