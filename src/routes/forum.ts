const express = require('express');
const router = express.Router();
const ForumController = require('../app/controllers/ForumController');

router.route('/page/:page')
    .get(ForumController.getAllForum);

router.route('/:courseId/page/:page')
    .get(ForumController.getDetailForumByCourseId);

    
module.exports = router;

