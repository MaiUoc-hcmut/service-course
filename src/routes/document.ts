const express = require('express');
const router = express.Router();

const DocumentController = require('../app/controllers/DocumentController');
const Authorize = require('../app/middleware/authorize');
const DocumentFile = require('../config/firebase/file');

router.route('/')
    .get(DocumentController.getAllDocuments)
    .post(DocumentFile.upload, DocumentController.createDocument);

router.route('/update')
    .put(DocumentFile.upload, DocumentController.updateDocumentForTopic);

router.route('/upload-file')
    .post(DocumentFile.upload, DocumentController.uploadFile);

router.route('/upload-multi-file')
    .post(Authorize.protectedAPI, DocumentFile.uploadMulti, DocumentController.uploadMultiFile);

router.route('/:documentId')
    .get(DocumentController.getDocumentById)
    .put(Authorize.authorizeTeacher, DocumentController.updateDocument)
    .delete(Authorize.authorizeTeacher, DocumentController.deleteDocument);

router.route('/teacher/:teacherId')
    .get(Authorize.authorizeTeacher, DocumentController.getDocumentCreatedByTeacher);

router.route('/course/:courseId')
    .get(DocumentController.getDocumentBelongToCourse);

router.route('/chapter/:chapterId')
    .get(DocumentController.getDocumentBelongToChapter);

router.route('/topic/:topicId')
    .get(DocumentController.getDocumentBelongToTopic);

router.route('/folder/:parentId')
    .get(Authorize.protectedAPI, DocumentController.getDocumentBelongToFolder);

module.exports = router;