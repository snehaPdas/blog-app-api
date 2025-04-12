const express = require("express");
const router = express.Router();

const { adminLogin, getAllUsers, blockUser, unblockUser } = require("../Controller/adminController");

router.post("/login", adminLogin);
router.get("/users", getAllUsers);
router.put('/block/:id',  blockUser);
router.put('/unblock/:id', unblockUser)

module.exports = router;