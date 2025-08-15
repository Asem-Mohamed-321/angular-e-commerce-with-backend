const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Cart = require('../Schemas/cart')

mongoose.connect('mongodb://localhost:27017')

router.get('/', async(req,res)=>{
    res.status(200).send(await Cart.find({}).populate('user').populate('product'))
}).post('/',async(req,res)=>{
    const userId = req.body.userId;
    const productId = req.body.productId;
    console.log(`post with userId = ${userId} ,and productId = ${productId}`)
    cartItem = await Cart.findOne({"user" :userId ,"product" :productId });
    if(cartItem){
        //increase the quantity by one
        cartItem.quantity +=1;
        await cartItem.save();
        return res.status(200).send({ message: "Quantity updated", cartItem });
    }else{
        const newCartItem = await Cart.create({
            user: userId,
            product: productId,
            quantity: 1
        });
        return res.status(201).send({ message: "Item added to cart", cartItem: newCartItem });
    }
}).put('/:id',async (req,res)=>{
    const id = req.params.id;
    const newCartItem = req.body;
    const oldCartItem = await Cart.findOne({_id : id})
    await Cart.updateOne(oldCartItem,newCartItem)
    res.status(201).send({message: "item edited"})
}).delete('/:id',async (req,res)=>{
   try {
        const result = await Cart.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing item' });
    }
})

module.exports = router ;