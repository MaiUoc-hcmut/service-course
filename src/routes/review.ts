const express = require('express');
const router = express.Router();
const reviewController = require("../app/controllers/ReviewController");
const Authorize = require('../app/middleware/authorize');
const CheckingReview = require('../app/middleware/review');
const FileUpload = require('../config/firebase/fileUpload');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        Authorize.verifyStudent, 
        CheckingReview.checkCreateReview, 
        FileUpload.uploadImage,
        reviewController.uploadReviewImage,
        reviewController.createReview
    );

router.route('/:reviewId')
    .get(reviewController.getReviewById)
    .delete(
        Authorize.verifyUser,
        CheckingReview.checkDeleteReview,
        reviewController.deleteReview
    );

router.route('/student/:studentId/page/:page')
    .get(reviewController.getReviewsBelongToStudent);

router.route('/basic/teacher/:teacherId')
    .get(reviewController.getBasicReviewInforOfTeacher);

router.route('/course/:courseId/page/:page')
    .get(reviewController.getReviewsForCourse);

router.route('/teacher/:teacherId')
    .get(reviewController.getAllReviewsOfAllCoursesOfTeacher);

module.exports = router;