const express = require('express');
const router = express.Router();
const lecturesRouter = require("./topic");

const chapterController = require("../app/controllers/ChapterController");
const fileUpload = require('../config/firebase/fileUpload');

///route chapter
router.use("/lectures", lecturesRouter)

router.route('/')
    .get(chapterController.getAllChapter)
    .post(fileUpload.uploadCourseFiles, chapterController.createChapter);

router.route('/:chapterId')
    .get(chapterController.getChapterById)
    .put(chapterController.updateChapter)
    .delete(chapterController.deleteChapter);

router.route('/course/:courseId')
    .get(chapterController.getChapterBelongToCourse);

// router.route('/:chapterId')
//     .get(chapterController.getChapter)

// router.get("/all", chapterController.getChapterFull);
// router.put("/:id", chapterController.update);
// router.delete("/:id", chapterController.delete);
// router.post("/", chapterController.create);

module.exports = router;
