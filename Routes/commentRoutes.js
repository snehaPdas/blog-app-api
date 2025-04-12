const express = require('express');
const router = express.Router();

const { createComment, getCommentsByPostId } = require('../Controller/commentController');

router.post('/create', createComment); // Route to create a comment
router.get('/:postid', getCommentsByPostId); // Route to get comments by post ID

module.exports = router;