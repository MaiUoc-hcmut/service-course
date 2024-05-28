const express = require('express');
const router = express.Router();

const UserInformationController = require('../app/controllers/UserInformationController');
const CheckingInformation = require('../app/middleware/information');
const Authorize = require('../app/middleware/authorize');

router.route('/teacher/:teacherId')
    .get(
        Authorize.checkGetAll,
        Authorize.verifyUser,
        CheckingInformation.checkGetTeacherInfor,
        UserInformationController.getTeacherInformation
    );

module.exports = router;