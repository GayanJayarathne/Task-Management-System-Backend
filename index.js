const express = require('express')
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
