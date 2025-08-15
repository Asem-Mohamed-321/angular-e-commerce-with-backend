const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: String,
    desc: String,
    price: String,
    reviews : Number,
    starts: Number,
    fav:Boolean,
    cat : String,
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;