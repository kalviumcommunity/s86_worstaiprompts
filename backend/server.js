const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
//Mongodb Connection
const mongoose = require('mongoose');

mongoose.connect(process.env.MongoDB_URI,{})
.then(()=>console.log('Mongodb is connected'))
.catch((err)=>console.log("Mongodb connection failed",err))

//connecting api routers
app.use(express.json())
const router = require('./routes/userRouter')
app.use('/users', router);


app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});