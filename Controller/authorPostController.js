const Post=require("../Model/postModel");

const addPost = async (req, res) => {
    try {
      const { title, content, category } = req.body;
  
      // Create a new post
      const newPost = new Post({ title, content, category });
      await newPost.save();
  
      // Populate category before sending back if needed
      const populatedPost = await Post.findById(newPost._id).populate("category");
  
      res.status(201).json({
        message: "Post created successfully",
        post: populatedPost,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to create post", error: err.message });
    }
  }
  const getPosts = async (req, res) => {
    try {
      // Fetch posts and populate category field
      const posts = await Post.find().populate("category");
  
      res.status(200).json({ posts });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch posts", error: err.message });
    }
  }
  const deletePost = async (req, res) => {
    try {
      const { postId } = req.params;  // Get the postId from request params
  
      // Find and delete the post by its ID
      const deletedPost = await Post.findByIdAndDelete(postId);
  
      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  const editPost = async (req, res) => {
    try {
      const { postId } = req.params;  // Get the postId from the request parameters
      const updatedPostData = req.body;  // Get the updated post data from the request body
  
      // Find the post by ID and update it with the new data
      const updatedPost = await Post.findByIdAndUpdate(postId, updatedPostData, { new: true });
  
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  module.exports = { addPost,getPosts,deletePost,editPost };