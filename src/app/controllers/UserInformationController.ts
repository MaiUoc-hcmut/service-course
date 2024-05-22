const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Topic = require('../../db/models/topic');
const Forum = require('../../db/models/forum');
const TopicForum = require('../../db/models/topicforum');
const Review = require('../../db/models/review');
const Comment = require('../../db/models/comment');

import { Request, Response, NextFunction } from 'express';

const { Op } = require('sequelize');

class UserInformationController {

    // [GET] /teacher/:teacherId
    getTeacherInformation = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;

            const startDay = new Date();
            startDay.setHours(0, 0, 0, 0)

            const course_quantity = await Course.count({
                where: { id_teacher }
            });

            const newCommentOnDay = await Comment.count({
                include: [{
                    model: Topic,
                    include: [{
                        model: Chapter,
                        include: [{
                            model: Course,
                            where: {
                                id_teacher
                            }
                        }]
                    }]
                }],
                where: {
                    createdAt: {
                        [Op.gte]: startDay
                    },
                    id_user: {
                        [Op.ne]: id_teacher
                    }
                }
            });

            const newTopicInForumOnDay = await TopicForum.count({
                include: [{
                    model: Forum,
                    include: [{
                        model: Course,
                        where: {
                            id_teacher
                        }
                    }]
                }],
                where: {
                    createdAt: {
                        [Op.gte]: startDay
                    },
                    id_user: {
                        [Op.ne]: id_teacher
                    }
                }
            })

            const newReviewCourseOnDay = await Review.count({
                include: [{
                    model: Course,
                    where: {
                        id_teacher
                    }
                }],
                where: {
                    createdAt: {
                        [Op.gte]: startDay
                    }
                }
            })
            
            res.status(200).json({
                course_quantity,
                newCommentOnDay,
                newTopicInForumOnDay,
                newReviewCourseOnDay
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }

    // [GET] /student/:studentId
    getStudentInformation = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.params.studentId;

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }
}

module.exports = new UserInformationController();