const Comment = require('../Model/commetModel'); // Adjust the path as needed

const createComment = async (req, res) => {
  try {
    const { userid, postid, content } = req.body;

    // Validate required fields
    if (!userid || !postid || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide userid, postid, and content' 
      });
    }

    // Create comment
    const newComment = new Comment({
      userid,
      postid,
      content // Note: You'll need to add this field to your schema
    });

    const savedComment = await newComment.save();

    res.status(201).json({
      success: true,
      data: savedComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

const getCommentsByPostId = async (req, res) => {
  try {
    const { postid } = req.params;

    // Find all comments for the post and populate user details
    const comments = await Comment.find({ postid })
      .populate('userid', 'name') // Adjust fields as needed
      .sort({ createdAt: -1 }); // Sort by newest first (requires timestamp)

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPostId
};