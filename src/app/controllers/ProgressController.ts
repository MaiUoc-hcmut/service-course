const Progress = require('../../db/models/course_progress');
const Course = require('../../db/models/course');

import { Request, Response, NextFunction } from 'express';

class ProgressController {

    // [GET] /progresses/:studentId/:courseId
    getProgressOfCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { studentId, courseId } = req.params;


            const course = await Course.findByPk(courseId);

            if (!course) {
                return res.status(404).json({
                    message: "Course does not exist!"
                });
            }

            const progress = await Progress.findAll({
                where: {
                    id_student: studentId,
                    id_course: courseId
                }
            });

            const totalTopic = course.total_lecture + course.total_exam;
            const percentageProgress = (progress.length / totalTopic) * 100;
            console.log(progress.length, totalTopic, percentageProgress);

            res.status(200).json({
                progress,
                percentage: `${percentageProgress}%`
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /progresses/increase
    increaseProgress = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        const { id_student, id_topic, id_course } = body;
        try {
            const record = await Progress.findOne({
                where: {
                    id_student,
                    id_topic
                }
            });
            if (record) {
                return res.status(200).json({
                    message: "This topic has been completed already!"
                });
            }

            const newProgress = await Progress.create({
                id_student,
                id_topic,
                id_course
            });

            res.status(201).json(newProgress);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new ProgressController();