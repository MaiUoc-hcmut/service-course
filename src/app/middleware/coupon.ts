const Coupon = require('../../db/models/coupon');
const Course = require('../../db/models/course');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

class CheckingCoupon {
    checkGetCouponOfTeacher = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            console.log(req.user?.user);
            const id_teacher = req.params.teacherId;
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            if (id_user !== id_teacher && role !== "admin") {
                let error = "You do not have permission to get this information!";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkCreateCoupon = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_teacher = req.teacher.data.id;

            const { courses } = req.body.data;

            for (const id of courses) {
                const course = await Course.findOne({
                    where: { id_teacher, id }
                });
                if (!course) {
                    let error = `You do not own course with id=${id} to add coupon!`;
                    return next(createError.Unauthorized(error));
                }
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkModifyCoupon = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_coupon = req.params.couponId;
            const id_teacher = req.teacher.data.id;

            const coupon = await Coupon.findByPk(id_coupon);
            if (!coupon) {
                let error = "Coupon does not exist!";
                return next(createError.BadRequest(error));
            }
            
            if (id_teacher !== coupon.id_teacher) {
                let error = "You do not have permission to do this action!";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingCoupon();