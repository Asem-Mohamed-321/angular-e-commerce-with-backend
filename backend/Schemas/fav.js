const mongoose = require('mongoose')
const favSchema = new mongoose.Schema({
    "product": { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    "user": {type : mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
})

const Fav = mongoose.model('favourites', favSchema)
module.exports = Fav;