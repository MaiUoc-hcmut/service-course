const express = require('express');
const router = express.Router();
const courseController = require("../app/controllers/CourseController");
const chaptersRouter = require("./chapters");

const fileUpload = require('../config/firebase/fileUpload');
const Authorize = require('../app/middleware/authorize');
const CheckingCourse = require('../app/middleware/course');

///route chapter
router.use("/chapters", chaptersRouter)

//route course
router.route('/')
    .post(Authorize.protectedAPI, courseController.createCourse)

router.route('/page/:page')
    .get(Authorize.checkGetAll, Authorize.verifyUser, courseController.getAllCourse)

router.route('/search/page/:page')
    .post(courseController.searchCourse);

router.route('/search/teacher/:teacherId/page/:page')
    .get(Authorize.verifyUser, CheckingCourse.checkSearchCourseOfTeacher, courseController.searchCourseOfTeacher);

router.route('/student-course')
    .get(courseController.getRecordsOfStudentCourseTable);

router.route('/:courseId')
    .get(courseController.getCourseById)
    .post(
        Authorize.verifyStudent,
        CheckingCourse.checkExistedCourse,
        CheckingCourse.checkStudentBuyCourse,
        courseController.studentBuyACourse
    )
    .put(Authorize.authorizeTeacher, CheckingCourse.checkModifyCourse, courseController.updateCourse)
    .delete(Authorize.authorizeTeacher, CheckingCourse.checkModifyCourse, courseController.deleteCourse);

router.route('/student/:studentId/page/:page')
    .get(Authorize.verifyUser, courseController.getCourseStudentPaid);

router.route('/full/:courseId')
    .get(Authorize.checkGetAll, Authorize.verifyUser, CheckingCourse.checkGetDetailCourse, courseController.getAllDetailCourse);

router.route('/teacher/:teacherId/page/:page')
    .get(
        Authorize.checkGetAll, 
        Authorize.verifyUser, 
        CheckingCourse.checkGetCourseCreatedByTeacher, 
        courseController.getCourseCreatedByTeacher
    );

router.route('/all-student/teacher/:teacherId/page/:page')
    .get(courseController.getStudentsBuyCoursesOfTeacher);

router.route('/:courseId/student-course/page/:page')
    .get(courseController.getStudentsBuyACourse);

router.post("/test", fileUpload.uploadCourseFiles, courseController.test);




module.exports = router;
