const express = require('express');
const router = express.Router();
const CouponController = require('../app/controllers/CouponController');
const Authorize = require('../app/middleware/authorize');
const CheckingCoupon = require('../app/middleware/coupon');


router.route('/')
    .post(Authorize.authorizeTeacher, CheckingCoupon.checkCreateCoupon, CouponController.addNewCoupon);

router.route('/:couponId')
    .get(CouponController.getCoupon)
    .put(Authorize.authorizeTeacher, CheckingCoupon.checkModifyCoupon, CouponController.updateCoupon)
    .delete(Authorize.authorizeTeacher, CheckingCoupon.checkModifyCoupon, CouponController.deleteCoupon);

router.route('/teacher/:teacherId')
    .get(Authorize.verifyUser, CheckingCoupon.checkGetCouponOfTeacher, CouponController.getCouponOfTeacher);


module.exports = router;