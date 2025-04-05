const express = require('express')
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");
const secretKey = process.env.JWT_SECRET_KEY;

dotenv.config();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/tasks", taskRoutes);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
