// Routes/readerAuthRoute.js

const express = require("express");
const authController = require("../Controller/authController");

const router = express.Router()


router.post("/login", authController.loginData);
router.post("/signup", authController.signupData);

module.exports = router
