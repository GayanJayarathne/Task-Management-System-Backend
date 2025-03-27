const express = require('express')
const app = express();
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://krgayan97:jlxdtOjLkyI2beuW@cluster0.c34arg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Connected to database!'));

app.listen(1000,() => {
    console.log("Server is running on port 1000")
});

app.get('/',(req,res)=>{
    res.send("Hello World");
})
