const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// Connect to DB
mongoose.connect(
    process.env.MONGO_DB_CONNECT
);

// Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Middlewares
// TODO: What does below code do?
app.use(express.json());

// Routes Middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(9999, console.log("The server is up and running!"));
