const express = require('express');
const router = express.Router();
const VideoController = require("../app/controllers/VideoController");
const FileUpload = require('../config/firebase/fileUpload');
const Authorize = require('../app/middleware/authorize');

router.route('/')
    .post(FileUpload.uploadVideo, VideoController.uploadSingleLectureVideo);

// router.route('/')
//     .post(Authorize.authorizeTeacher, FileUpload.uploadVideo, VideoController.uploadSingleLectureVideo);

router.route('/update')
    .put(FileUpload.uploadVideo, VideoController.uploadSingleLectureVideoForUpdate);

// router.route('/update')
//     .put(Authorize.authorizeTeacher, FileUpload.uploadVideo, VideoController.uploadSingleLectureVideoForUpdate);

module.exports = router;