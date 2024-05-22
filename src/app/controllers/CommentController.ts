import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
const Comment = require('../../db/models/comment');
const Topic = require('../../db/models/topic');
const Chapter = require('../../db/models/chapter');
const Course = require('../../db/models/course');
const axios = require('axios');

require('dotenv').config();

const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig } = require('../../config/firebase/firebase');
const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    getStorage,
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');

const { sequelize } = require('../../config/db/index');

initializeApp(firebaseConfig);
const storage = getStorage();

declare global {
    namespace Express {
        interface Request {
            ImageUrl: string;
            user?: USER
        }
    
    }
}

class CommentController {
    // [GET] /comments
    getAllComment = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const comments = await Comment.findAll();

            res.status(200).json(comments);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /comments/:commentId
    getCommentById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const comment = await Comment.findByPk(req.params.commentId);

            if (!comment) return res.status(404).json({ message: "Comment does not exist" });

            res.status(200).json(comment);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /comments/topic/:topicId/page/:page
    getCommentBelongToTopic = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_topic = req.params.topicId

            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Comment.count({
                where: { 
                    id_topic, 
                    id_parent: {
                        [Op.or]: [null, ""]
                    } 
                }
            });

            const comments = await Comment.findAll({
                where: { 
                    id_topic, 
                    id_parent: {
                        [Op.or]: [null, ""]
                    }
                },
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                include: [
                    // Include replies (answers) of each answer
                    {
                        model: Comment,
                        as: 'replies',
                        separate: true, // Ensure that replies are loaded separately
                        // limit: pageSize, // Limit the number of replies for each comment
                        order: [['createdAt', 'ASC']] // You can adjust the ordering as needed
                    }
                ]
            });

            for (const comment of comments) {
                if (comment.role === "student") {
                    const user = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${comment.id_user}`);

                    comment.dataValues.user = { avatar: user.data.avatar, name: user.data.name, role: comment.role };
                    delete comment.dataValues.role;
                } else if (comment.role === "teacher") {
                    const user = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${comment.id_user}`);

                    comment.dataValues.user = { avatar: user.data.avatar, name: user.data.name, role: comment.role };
                    delete comment.dataValues.role;
                }
            }

            res.status(200).json({ count, comments });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /comments/student/:studentId/page/:page
    getCommentCreatedByStudent = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_student = req.params.studentId;

            const currentPage: number = +req.params.page;
            
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Comment.count({
                where: { id_student }
            })

            const comments = await Comment.findAll({
                where: { id_student },
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: pageSize * (currentPage - 1)
            });

            res.status(200).json({ count, comments });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /comments/create
    createComment = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            let body = req.body.data;

            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const topic = await Topic.findByPk(body.id_topic);
            const chapter = await Chapter.findByPk(topic.id_chapter);
            const course = await Course.findByPk(chapter.id_course);

            const id_user = req.user?.user.data.id;
            const name = req.user?.user.data.name;
            const role = req.user?.role;

            const newComment = await Comment.create({
                id_user,
                ...body,
                role,
                image: req.ImageUrl
            }, {
                transaction: t
            });

            if (role === "student") {
                try {
                    const data = {
                        id_teacher: course.id_teacher,
                        id_topic: body.id_topic,
                        id_course: course.id,
                        course_name: course.name,
                        student_name: name
                    }
                    const response = await axios.post(`${process.env.BASE_URL_NOTIFICATION_LOCAL}/notification/comment-on-lecture`, { data });
                } catch (error: any) {
                    console.log(error.message);
                }
            }

            await t.commit();
            
            res.status(201).json(newComment);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }

    uploadCommentImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;

            if (file) {
                const dateTime = fileUpload.giveCurrentDateTime();
    
                const storageRef = ref(
                    storage,
                    `comments/${file?.originalname + '       ' + dateTime}`
                );
    
                // Create file metadata including the content type
                const metadata = {
                    contentType: file?.mimetype,
                };
    
                // Upload the file in the bucket storage
                const snapshot = await uploadBytesResumable(
                    storageRef,
                    file?.buffer,
                    metadata
                );
    
                // Grab the public url
                const downloadURL = await getDownloadURL(snapshot.ref);
                req.ImageUrl = downloadURL;
            }

            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [PUT] /comments/:id
    update(req: Request, res: Response, next: NextFunction) {
        Comment.update(req.body.data, {
            where: {
                id: req.params.id,
            },
        })
            .then((comment: any) => res.send(comment))
            .catch(next);
    }

    // [DELETE] /comments/:commenId
    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await Comment.findByPk(req.params.commentId);

            if (!comment) return res.status(404).json({ message: "Comment does not exist" });

            await comment.destroy();

            res.status(200).json({
                id: req.params.commentId,
                message: "Comment has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

}

module.exports = new CommentController();
