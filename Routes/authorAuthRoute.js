const express = require("express");
const router = express.Router();
const authorUthController=require("../Controller/authorAuthController")
const authorCategoryController=require("../Controller/authorCategoryController")
const authorPostController=require("../Controller/authorPostController");
const { veryfyToken } = require("../middlewares/authMiddleware");

router.post("/login", authorUthController.loginData);
router.post("/signup", authorUthController.signupData);
router.post("/categories",veryfyToken, authorCategoryController.addCategory)
router.get("/categories",veryfyToken, authorCategoryController.getCategories)
router.post("/posts",veryfyToken, authorPostController.addPost)
router.get("/posts",veryfyToken, authorPostController.getPosts)
router.delete("/posts/:postId",veryfyToken, authorPostController.deletePost)
router.put("/posts/:postId",veryfyToken, authorPostController.editPost)



module.exports = router;
