const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017').then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
});

const User = require('./Schemas/user.js')
const Product = require('./Schemas/product.js')


const productRouter = require('./routes/product.js');
const catRouter = require('./routes/cat.js');
const cartRouter = require('./routes/cart.js')
const favRouter = require('./routes/fav.js')
const userRoute = require('./routes/user.js')
app.use('/products' , productRouter)
app.use('/categories' , catRouter)
app.use('/cart' , cartRouter)
app.use('/favourites' , favRouter)
app.use('/user',userRoute)


app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});