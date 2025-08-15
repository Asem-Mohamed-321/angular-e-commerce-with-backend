const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    "product": { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    "user": {type : mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
    "quantity": Number
})

const Cart = mongoose.model('cartItems', cartSchema)
module.exports = Cart;