const express = require('express');
const router = express.Router();

const FolderController = require('../app/controllers/FolderController');
const Authorize = require('../app/middleware/authorize');

// router.route('/')
//     .get(FolderController.getAllFolders);
router.route('/getFolderById/:folderId')
    .get(FolderController.getFolderById);
    
router.route('/getSubFolder')
    .get(FolderController.getFoldersByParent);
router.route('/getSubFolder/:parentId')
    .get(FolderController.getFoldersByParent);

router.route('/create')
    .post(Authorize.protectedAPI, FolderController.createFolder);
router.route('/create/:parentId')
    .post(Authorize.protectedAPI, FolderController.createFolder);

router.route('/copy')
    .post(Authorize.authorizeTeacher, FolderController.copyFolder);
router.route('/copy/:parentId')
    .post(Authorize.authorizeTeacher, FolderController.copyFolder);

router.route('/update/:folderId')
    .put(Authorize.authorizeTeacher, FolderController.updateFolder);

router.route('/delete/:folderId')
    .delete(Authorize.authorizeTeacher, FolderController.deleteFolder);
    
module.exports = router;