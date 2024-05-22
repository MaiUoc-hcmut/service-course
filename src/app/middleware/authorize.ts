const passport = require('passport');
require('./passport');
const dotenv = require('dotenv').config();
const createError = require('http-errors');

const Course = require('../../db/models/course');
const Comment = require('../../db/models/comment');
const Topic = require('../../db/models/topic');

import { Request, Response, NextFunction } from "express";

const axios = require('axios');


declare global {
    namespace Express {
        interface Request {
            teacher?: any;
            student?: any;
            user?: USER;
            getAll?: boolean;
            authority?: number;
        }
    }

    type USER = {
        user?: any,
        role?: string,
        authority?: number
    }
}

class Authorize {
    getUserFromAPI = async (url: string) => {
        try {
            const response = await axios.get(url);
            return {
                data: response.data
            }
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            } else {
                throw error;
            }
        }
    }

    authorizeTeacher = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('jwt', { session: false }, async (err: any, teacher: any, info: any) => {
            if (err || !teacher) {
                return next(createError.Unauthorized(info?.message ? info.message : err));
            }
            if (req.params.teacherId && req.params.teacherId !== teacher.data.id) {
                return next(createError.Unauthorized("You do not have permission to get the courses"))
            }
            if (req.params.courseId) {
                const course = await Course.findByPk(req.params.courseId);
                if (!course) return next(createError.NotFound("Course does not exist"));
                if (teacher.data.id !== course.id_teacher) {
                    return next(createError.Unauthorized("You do not have permission to get the courses"));
                }
            }
            req.teacher = teacher;
            next();
        })(req, res, next);
    }

    verifyUser = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('user-jwt', { session: false }, async (err: any, id: string, info: any) => {
            if (err || !id) {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token && req.getAll) {
                    req.authority = 0;
                    return next();
                }
                return next(createError.Unauthorized(info?.message ? info.message : err))
            }

            let user: {
                user?: any,
                role?: string
            } = {};

            try {
                const student = await this.getUserFromAPI(`${process.env.BASE_URL_LOCAL}/student/${id}`);
                if (student) {
                    user.user = student;
                    user.role = "student";
                    req.user = user;
                    return next();
                }

                const teacher = await this.getUserFromAPI(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${id}`);
                if (teacher) {
                    user.user = teacher;
                    user.role = "teacher";
                    req.user = user;
                    return next();
                }

                const admin = await this.getUserFromAPI(`${process.env.BASE_URL_LOCAL}/admin/${id}`);
                if (admin) {
                    user.user = admin;
                    user.role = "admin";
                    req.user = user;
                    req.authority = 2;
                    return next();
                }

                return next(createError.NotFound("User not found!"));
            } catch (error: any) {
                return next(createError.InternalServerError(error.message));
            }

        })(req, res, next);
    }

    verifyStudent = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('user-jwt', { session: false }, async (err: any, id: string, info: any) => {
            if (err) {
                return next(createError.Unauthorized(info?.message ? info.message : err))
            }
            try {
                console.log(req.headers.authorization);

                console.log(125, id);

                const student = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${id}`);
                req.student = student;
                next();
            } catch (error: any) {
                console.log(error.message);
                next(error);
            }
        })(req, res, next);
    }

    protectedAPI = (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('jwt', { session: false }, (err: any, teacher: any, info: any) => {
            if (err || !teacher) {
                return next(createError.Unauthorized(info?.message ? info.message : err));
            } else {
                req.teacher = teacher;
                next();
            }
        })(req, res, next);
    };

    checkGetAll = (req: Request, res: Response, next: NextFunction) => {
        req.getAll = true;
        next();
    };
}

module.exports = new Authorize();