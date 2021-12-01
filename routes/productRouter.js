const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Products = require('../models/products');

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.route('/')
.get((req,res,next) => {
    Products.find({})
    .then((products) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
.post(authenticate.verifyUser, (req,res,next) => {
    Products.create(req.body)
    .then((product) => {
        console.log('Product created', product);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /products');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Products.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    
    }, (err) => next(err))
    .catch((err) => next(err));
});

productRouter.route('/:productId')
.get((req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not allowed on /products/' + req.params.productId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Products.findByIdAndUpdate(req.params.productId, {
        $set: req.body
    },{ new: true })
    .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Products.findByIdAndRemove(req.params.productId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);    
    }, (err) => next(err))
    .catch((err) => next(err));
})


productRouter.route('/:productId/comments')
.get((req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        if (product != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product.comments);
        }
        else{
            err = new Error('Product ' + req.params.productId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
.post(authenticate.verifyUser, (req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        if (product != null){
            product.comments.push(req.body);
            product.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            }, (err) => next(err));
        }
        else{
            err = new Error('Product ' + req.params.productId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /products'
        + req.params.productId + '/comments');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        if (product != null){
            for (var i = (product.comments.length -1); i >= 0; i--){
                product.comments.id(product.comments[i]._id).remove();
            }
            product.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            }, (err) => next(err));
        }
        else{
            err = new Error('Product ' + req.params.productId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

productRouter.route('/:productId/comments/:commentId')
.get((req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        if (product != null && product.comments.id(req.params.commentId) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(product.comments.id(req.params.commentId));
        }
        else if (product == null) {
            err = new Error('Product ' + req.params.productId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err)); 
})
.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation is not allowed on /products/' + req.params.productId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        if (product != null && product.comments.Id(req.params.commentId) != null){
            if (req.body.rating){
                product.comment.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment){
                product.comment.id(req.params.commentId).comment = req.body.comment;
            }
            product.comments.push(req.body);
            product.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            }, (err) => next(err));
        }
        else if (product == null) {
            err = new Error('Product ' + req.params.productId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}) 
.delete(authenticate.verifyUser, (req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        if (product != null && product.comments.Id(req.params.commentId) != null){
            product.comments.id(req.params.commentId).remove();
            product.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            }, (err) => next(err));
        }
        else if (product == null) {
            err = new Error('Product ' + req.params.productId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
module.exports = productRouter;