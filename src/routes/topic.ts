const express = require('express');
const router = express.Router();
const fileUpload = require('../config/firebase/fileUpload');

const topicController = require("../app/controllers/TopicController");

router.route('/')
    .get(topicController.getAllTopics)
    // .post(fileUpload.uploadCourseFiles, topicController.uploadTopicVideo, topicController.createTopic);

router.route('/check/exam/:examId')
    .get(topicController.getTopicByExam);

router.route('/:topicId')
    .get(topicController.getTopicById)
    .put(topicController.updateTopic)
    .delete(topicController.deleteTopic);

router.route('/test')
    .post(fileUpload.uploadVideo, topicController.test);
module.exports = router;
