const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const User = require("../Schemas/user");

mongoose.connect("mongodb://localhost:27017");

router.post("/register", async (req,res)=>{
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password , 10);
    const user = {
        name: req.body.username,
        password: hashedPassword,
        email: req.body.email
    }
    try{
        await User.create(user);
        res.status(201).send('User created successfully');
    }
    catch(err){
        console.error(err);
        return res.status(500).send('Error creating user');
    }

}).post("/login",async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(404).send('user not found')
    }
    console.log(user)
    console.log(req.body.password)
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
        console.log("wrong password");

        return res.status(401).send('wrong password')
    }else{
        const {password , ...user_withoutPass} = user.toObject();
        const token = jwt.sign({data : user_withoutPass},"privateKey");
        res.status(200).send(token);
        console.log("right password");
    }
}).get("/:id",async(req,res)=>{
    try{
        const user = await User.findOne({_id : req.params.id})
        if(user){
            return res.status(200).send(user)
        }else{
            return res.status(404).send({message : "no user with this id is found"})
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).send({message : "server error : "})
    }
}).put("/:id",async(req,res)=>{
    // console.log(req.body)
    // console.log(req.params.id)
    try{
        
        const { _id, ...updateData } = req.body;

        const user = await User.findOne({_id : req.params.id})
        if(user){
            const updatedUser = await User.updateOne({ _id: req.params.id },updateData)
            return res.status(200).send(updatedUser)
        }else{
            return res.status(404).send({message : "no user with this id is found"})
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).send({message : "server error : "})
    }
})

module.exports = router;
