const express = require('express');
const router = express.Router();
const ProgressController = require('../app/controllers/ProgressController');

router.route('/increase')
    .post(ProgressController.increaseProgress);

router.route('/:studentId/:courseId')
    .get(ProgressController.getProgressOfCourse);


module.exports = router;
