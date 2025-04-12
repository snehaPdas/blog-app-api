const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const readerRoute = require("./Routes/readerAuthRoute");
const authorRoute = require("./Routes/authorAuthRoute");
const commentRoute = require("./Routes/commentRoutes");
const adminRoute = require("./Routes/adminAuthRoute");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/", readerRoute)
app.use("/author", authorRoute);
app.use("/comment", commentRoute)
app.use("/admin", adminRoute)
// app.use("/admin", adminRoute)


app.listen(4000, () => console.log("Server running on port 4000"));
