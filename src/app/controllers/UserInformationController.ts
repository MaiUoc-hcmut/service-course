const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Topic = require('../../db/models/topic');
const Forum = require('../../db/models/forum');
const TopicForum = require('../../db/models/topicforum');
const Review = require('../../db/models/review');
const Comment = require('../../db/models/comment');
const StudentCourse = require('../../db/models/student-course');

import { Request, Response, NextFunction } from 'express';

const { Op } = require('sequelize');

class UserInformationController {

    // [GET] /teacher/:teacherId
    getTeacherInformation = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.params.teacherId;
            const authority = req.authority;

            const startDay = new Date();
            startDay.setHours(0, 0, 0, 0);

            const status = authority === 3
                ? ['public', 'paid', 'private', 'draft']
                : (
                    authority === 2
                    ? ['public', 'paid', 'private']
                    : ['public', 'paid']
                );

            const course_quantity = await Course.count({
                where: { 
                    id_teacher,
                    status
                }
            });

            const studentRecords = await StudentCourse.findAll({
                include: [{
                    model: Course,
                    where: {
                        id_teacher
                    }
                }]
            });

            let students: string[] = [];

            for (const record of studentRecords) {
                if (students.includes(record.id_student)) {
                    continue
                } else {
                    students.push(record.id_student);
                }
            }

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
                student_quantity: students.length,
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