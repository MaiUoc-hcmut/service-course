const express = require('express');
const router = express.Router();
const TopicForumController = require('../app/controllers/TopicForumController');
const Authorize = require('../app/middleware/authorize');
const CheckingTopic = require('../app/middleware/topicforum');
const FileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .post(
        Authorize.verifyUser, 
        FileUpload.uploadFile, 
        CheckingTopic.checkCreateTopic,
        TopicForumController.uploadFile, 
        TopicForumController.createTopic
    );

router.route('/')
    .get(TopicForumController.getAllTopics);

router.route('/:topicId/page/:page')
    .get(TopicForumController.getDetailTopicById);

router.route('/search/:forumId/page/:page')
    .get(TopicForumController.searchTopicInForum);

router.route('/:topicId')
    .put(
        Authorize.verifyUser,
        FileUpload.uploadFile,
        CheckingTopic.checkUpdateTopic,
        TopicForumController.uploadFile,
        TopicForumController.updateTopic
    )
    .delete(
        Authorize.verifyUser,
        CheckingTopic.checkDeleteTopic,
        TopicForumController.deleteTopic
    );

module.exports = router;

