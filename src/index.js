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
const userRoute = require("./routes/user");
const postRoute = require("./routes/posts");
const oauthRoute = require("./routes/oauth");

// Middlewares
// TODO: What does below code do?
app.use(express.json());

// Routes Middlewares
app.use("/api/user", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/oauth", oauthRoute);

app.listen(9999, console.log("The server is up and running!"));
