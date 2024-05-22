const express = require('express');
const router = express.Router();

const testControler = require('../app/controllers/test');

const fileUpload = require('../config/firebase/fileUpload');

router.post('/', fileUpload.uploadVideo, testControler.testUploadFile);
router.get('/search', testControler.testSearchEngineAlgolia);
router.post('/update', testControler.testSaveObjectAlgolia);
router.get('/get-header', testControler.testLogHeader);
router.get('/search/course/teacher/:teacherId', testControler.testSearchCourseOfTeacher);
router.get('/get-query', testControler.testGetQuery);

module.exports = router;