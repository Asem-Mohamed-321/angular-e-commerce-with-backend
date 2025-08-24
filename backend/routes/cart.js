const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Cart = require('../Schemas/cart')
const jwt = require('jsonwebtoken')

mongoose.connect('mongodb://localhost:27017')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Auth header:", authHeader);

  const token = authHeader?.split(' ')[1];
  console.log("Extracted token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, "privateKey");
    console.log("Decoded token:", decoded);
    req.user = decoded.data;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).send({ message: 'Invalid token' });
  }
};


router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user._id; // extracted from token
  const userCart = await Cart.find({ user: userId }).populate('product');
  res.status(200).send(userCart);
}).post('/', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  const productId = req.body.productId;

  const existingItem = await Cart.findOne({ user: userId, product: productId });

  if (existingItem) {
    existingItem.quantity += 1;
    await existingItem.save();
    return res.status(200).send({ message: "Quantity updated", cartItem: existingItem });
  }

  const newItem = await Cart.create({
    user: userId,
    product: productId,
    quantity: 1
  });

  res.status(201).send({ message: "Item added to cart", cartItem: newItem });
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