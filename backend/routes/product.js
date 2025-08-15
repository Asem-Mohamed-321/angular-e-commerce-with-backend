const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017')

const Product = require('../Schemas/product')

router.get("/", async(req,res)=>{
    res.send(await Product.find({}))
})

router.post('/',async(req,res)=>{
    const product = {
        image: req.body.image,
        desc: req.body.desc,
        price: req.body.price,
        reviews: req.body.reviews,
        starts: req.body.starts,
        fav: req.body.fav,
        cat: req.body.cat
    }
    await Product.create(product);
    res.status(201).send('Product created successfully');
})

router.delete('/:id' , async(req,res)=>{
    const cat =  await Product.findOne({_id : req.params.id})
    console.log(req.params.id)
    await Product.deleteOne({_id : req.params.id})
    res.send(cat)
})

router.put('/:id',async(req,res)=>{
    const updatedProduct = req.body;
    const oldProduct = await Product.findOne({_id : req.params.id})
    await Product.updateOne(oldProduct,updatedProduct)
    res.send(updatedProduct)
})
module.exports = router;
