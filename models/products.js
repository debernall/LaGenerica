const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true
    }

},{
    timestamps: true
});

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Currency,
        required: true,
        min: 0
    },
    label:{
        type: String,
        default: ''
    },
    featured:{
        type: Boolean,
        default: false
    },
    comments: [ commentSchema ]
},{
    timestamps: true
});

var Products = mongoose.model('Product', productSchema);

module.exports = Products;
