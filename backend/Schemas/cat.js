
const mongoose = require('mongoose')
const catSchema = new mongoose.Schema({
    "cat":{
        type : String,
        required : true,

    }
})

const Cat = mongoose.model('Category' , catSchema)
module.exports = Cat;