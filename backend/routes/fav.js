const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Fav = require("../Schemas/fav");

mongoose.connect("mongodb://localhost:27017");

router
  .get("/", async (req, res) => {
    res
      .status(200)
      .send(await Fav.find({}).populate("user").populate("product"));
  })
  .post("/", async (req, res) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    try {
      const exists = await Fav.findOne({ user: userId, product: productId });
      if (exists) {
        await Fav.deleteOne({ user: userId, product: productId });
        return res
          .status(200)
          .send({ message: "deleted product from favourites" });
      } else {
        const newFac = {
          user: userId,
          product: productId,
        };
        await Fav.create(newFac);
        return res
          .status(201)
          .send({ message: "Added a new product to favourites" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Server error" });
    }
  }).get("/detailed/:id",async(req,res)=>{
    return res.status(200).send(await Fav.find({user : req.params.id}).populate("product"))
  }).get("/:id",async(req,res)=>{
    
    return res.status(200).send(await Fav.find({user : req.params.id}))
  }).delete("/:id",async(req,res)=>{
    const userId = req.body.userId;
    return res.status(200).send(await Fav.findOneAndDelete({user :userId ,product : req.params.id}))
  })
  

module.exports = router;
