const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = mongoose.Schema({

    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    },
    status: {
        type: String,
        default:"No Ship"
    }



},{timestamps: true})
    
    
const Order = mongoose.model('Order', orderSchema);

module.exports = { Order }