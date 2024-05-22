const express = require('express');
const router = express.Router();

const UserInformationController = require('../app/controllers/UserInformationController');

router.route('/teacher/:teacherId')
    .get(UserInformationController.getTeacherInformation);

module.exports = router;