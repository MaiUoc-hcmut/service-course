const Coupon = require('../../db/models/coupon');
const Course = require('../../db/models/course');

import { Request, Response, NextFunction } from 'express';

const { sequelize } = require('../../config/db/index');

require('dotenv').config();

class CouponController {

    // [GET] /coupons/:couponId
    getCoupon = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_coupon = req.params.couponId;

            const coupon = await Coupon.findOne({
                where: { id: id_coupon },
                include: [
                    {
                        model: Course,
                        attributes: ['id', 'name', 'thumbnail', 'cover_image'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            res.status(200).json(coupon);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [GET] /coupons/teacher/:teacherId
    getCouponOfTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const coupons = await Coupon.findAll({
                where: {
                    id_teacher
                },
                include: [
                    {
                        model: Course,
                        // attributes: ['id', 'name', 'thumbnail', 'cover_image'],
                        through: {
                            attributes: []
                        }
                    }
                ]
            });

            res.status(200).json(coupons);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    // [POST] /coupons
    addNewCoupon = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_teacher = req.teacher.data.id;
            const { courses, ...couponBody } = req.body.data;
            if (!couponBody.start_time) {
                return res.status(400).json({
                    message: "Coupon must have start date"
                });
            }
            if (!couponBody.expire) {
                return res.status(400).json({
                    message: "Coupon must have expire date"
                });
            }
            if (typeof couponBody.percent !== "number" || couponBody.percent < 0 || couponBody.percent > 100) {
                return res.status(400).json({
                    message: "Percent must be in range 0 - 100 and must be type of integer"
                });
            }
            couponBody.expire = new Date(couponBody.expire);
            couponBody.start_time = new Date(couponBody.start_time);

            const coupon = await Coupon.create({
                ...couponBody,
                id_teacher
            }, {
                transaction: t
            });

            if (courses) {
                let coursesObject = [];
                for (const id of courses) {
                    const course = await Course.findByPk(id);
                    coursesObject.push(course);
                }
                await coupon.addCourses(coursesObject, { transaction: t });
            }

            await t.commit();

            res.status(201).json(coupon);

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });

            await t.rollback();
        }
    }

    // [PUT] /coupons/:couponId
    updateCoupon = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction()
        try {
            const id_coupon = req.params.couponId;
            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const coupon = await Coupon.findByPk(id_coupon);

            await coupon.update({
                ...body
            }, {
                transaction: t
            });

            await t.commit();

            res.status(200).json(coupon);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });

            await t.rollback();
        }
    }

    // [DELETE] /coupons/:couponId
    deleteCoupon = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_coupon = req.params.couponId;

            await Coupon.destroy({
                where: { id: id_coupon }
            }, {
                transaction: t
            });

            await t.commit();

            res.status(200).json({
                message: "Coupon has been deleted!",
                coupon: id_coupon
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });

            await t.rollback();
        }
    }
}


module.exports = new CouponController();