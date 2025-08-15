const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Cat = require('../Schemas/cat')

mongoose.connect('mongodb://localhost:27017')

router.get('/', async(req,res)=>{
    res.status(200).send(await Cat.find({}))
}).post('/',async(req,res)=>{
    const cat = {
        cat: req.body.cat
    }
    await Cat.create(cat);
    res.status(201).send('Category created successfully');
})



module.exports = router ;