const express = require('express');
const router = express.Router();
const CommentController = require("../app/controllers/CommentController");
const Authorize = require('../app/middleware/authorize');
const CheckingComment = require('../app/middleware/comment');
const FileUpload = require('../config/firebase/fileUpload');

// const fileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .get(CommentController.getAllComment)
    .post(
        Authorize.verifyUser, 
        CheckingComment.checkCreateComment, 
        FileUpload.uploadImage,
        CommentController.uploadCommentImage,
        CommentController.createComment
    );

router.route('/:commentId')
    .get(CommentController.getCommentById)
    .delete(CommentController.deleteComment)

router.route('/topic/:topicId/page/:page')
    .get(CommentController.getCommentBelongToTopic);

router.put("/:id", CommentController.update);

module.exports = router;
