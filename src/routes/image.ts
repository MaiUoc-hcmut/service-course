const express = require('express');
const router = express.Router();
const imageController = require("../app/controllers/ImageController");
const FileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .post(FileUpload.uploadImage, imageController.uploadImageWithBody);

router.route('/single')
    .post(FileUpload.uploadImage, imageController.uploadSingleImage);

module.exports = router;