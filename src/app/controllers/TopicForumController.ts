const Forum = require('../../db/models/forum');
const TopicForum = require('../../db/models/topicforum');
const Answer = require('../../db/models/answer');
const Course = require('../../db/models/course');

const FileUpload = require('../../config/firebase/fileUpload');
const Authorize = require('../middleware/authorize');

import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';

const { sequelize } = require('../../config/db/index');

const algoliasearch = require('algoliasearch');
const axios = require('axios');

require('dotenv').config();

const { firebaseConfig } = require('../../config/firebase/firebase');
const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    getStorage,
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');
initializeApp(firebaseConfig);
const storage = getStorage();

class TopicForumController {

    // [GET] /topicforums/page/:page
    getAllTopics = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const topics = await TopicForum.findAll();

            res.status(200).json(topics);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /topicsforum/:topicId/page/:page
    getDetailTopicById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_topic = req.params.topicId;

            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const count = await Answer.count({
                where: {
                    id_topic_forum: id_topic,
                    id_parent: {
                        [Op.or]: [null, ""]
                    }
                }
            });

            const topic = await TopicForum.findByPk(id_topic, {
                include: [
                    {
                        where: {
                            id_parent: {
                                [Op.or]: [null, ""]
                            }
                        },
                        model: Answer,
                        as: 'answers',
                        order: [['createdAt', 'DESC']],
                        limit: pageSize,
                        offset: pageSize * (currentPage - 1),
                        include: [
                            // Include replies (answers) of each answer
                            {
                                model: Answer,
                                as: 'replies',
                                separate: true, // Ensure that replies are loaded separately
                                // limit: pageSize, // Limit the number of replies for each answer
                                order: [['createdAt', 'ASC']] // You can adjust the ordering as needed
                            }
                        ]
                    }
                ]
            });

            if (topic.role === "student") {
                const author = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${topic.id_user}`);

                topic.dataValues.author = { avatar: author.data.avatar, name: author.data.name, id: author.data.id, role: author.data.role };
                delete topic.dataValues.role;
            } else {
                const author = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${topic.id_user}`);

                topic.dataValues.author = { avatar: author.data.avatar, name: author.data.name, role: topic.role, id: author.data.id };
                delete topic.dataValues.role;
            }

            for (const answer of topic.answers) {
                if (answer.role === "student") {
                    const user = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${answer.id_user}`);

                    answer.dataValues.user = { avatar: user.data.avatar, name: user.data.name, role: answer.role, id: user.data.id };
                    delete answer.dataValues.role;
                } else if (answer.role === "teacher") {
                    const user = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${answer.id_user}`);

                    answer.dataValues.user = { avatar: user.data.avatar, name: user.data.name, role: answer.role, id: user.data.id };
                    delete answer.dataValues.role;
                }
                for (const reply of answer.replies) {
                    if (reply.role === "student") {
                        const user = await axios.get(`${process.env.BASE_URL_LOCAL}/student/${reply.id_user}`);

                        reply.dataValues.user = { avatar: user.avatar, name: user.name, role: reply.role, id: user.data.id };
                        delete reply.dataValues.role;
                    } else if (reply.role === "teacher") {
                        const user = await axios.get(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${reply.id_user}`);

                        reply.dataValues.user = { avatar: user.data.avatar, name: user.data.name, role: reply.role, id: user.data.id };
                        delete reply.dataValues.role;
                    }
                }
            }

            res.status(200).json({
                count,
                topic
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /topicsforum/search/:forumId/page/:page
    searchTopicInForum = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_TOPIC_NAME);
        try {
            const currentPage: number = +req.params.page;
            const pageSize: number = parseInt(process.env.SIZE_OF_PAGE || '10');

            const query = req.query.query;

            const filters = `id_forum:${req.params.forumId}`;

            const result = await index.search(query, {
                filters,
                hitsPerPage: pageSize,
                page: currentPage - 1
            });

            for (const topic of result.hits) {
                if (!topic.author.avatar) {
                    delete topic.author;
                    const student = await Authorize.getUserFromAPI(`${process.env.BASE_URL_LOCAL}/student/${topic.id_user}`);
                    if (student) {
                        topic.author = {
                            id: student.data.id,
                            name: student.data.name,
                            avatar: student.data.avatar
                        };
                    }

                    const teacher = await Authorize.getUserFromAPI(`${process.env.BASE_URL_LOCAL}/teacher/get-teacher-by-id/${topic.id_user}`);
                    if (teacher) {
                        topic.author = {
                            id: teacher.data.id,
                            name: teacher.data.name,
                            avatar: teacher.data.avatar
                        };
                    }
                }
            }

            res.status(200).json({
                total: result.nbHits,
                result: result.hits
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /topicsforum
    createTopic = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_TOPIC_NAME);

        const t = await sequelize.transaction();

        try {
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            const topic = await TopicForum.create({
                id_user,
                role,
                file: req.ImageUrl,
                ...body
            }, {
                transaction: t
            });

            const forum = await Forum.findByPk(body.id_forum);
            const course = await Course.findByPk(forum.id_course);

            const total_topic = forum.total_topic + 1;

            await forum.update({ total_topic }, { transaction: t });

            const data = {
                id_forum: forum.id,
                id_course: forum.id_course,
                name: body.title,
                id_topic: topic.id,
                course_name: course.name,
                author: id_user
            }

            const response = await axios.post(`${process.env.BASE_URL_NOTIFICATION_LOCAL}/notification/create-topic`, { data });

            await t.commit();

            const dataValues = topic.dataValues;

            const algoliaDataSave = {
                ...dataValues,
                objectID: topic.id,
                author: {
                    id: req.user?.user.data.id,
                    name: req.user?.user?.data.name,
                    avatar: req.user?.user.data.avatar
                }
            }

            await index.saveObject(algoliaDataSave);

            res.status(201).json(topic);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }

    uploadFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;

            if (file) {
                const dateTime = FileUpload.giveCurrentDateTime();

                const storageRef = ref(
                    storage,
                    `topic forum/${file?.originalname + '       ' + dateTime}`
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

    // [PUT] /topicsforum/:topicId
    updateTopic = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_TOPIC_NAME);

        const t = await sequelize.transaction();
        try {
            let body = req.body.data;
            if (typeof body === "string") {
                body = JSON.parse(body);
            }

            const TopicFile = req.ImageUrl;

            const id_topic = req.params.topicId
            const topic = await TopicForum.findByPk(id_topic);
            let file = topic.file;
            if (TopicFile) {
                file = TopicFile;
            }

            await topic.update({ ...body, file }, { transaction: t });

            await t.commit();

            const dataToUpdate = {
                objectID: id_topic,
                ...body,
                file
            }

            await index.partialUpdateObject(dataToUpdate);

            res.status(200).json(topic);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }

    // [DELETE] /topicsforum/:topicId
    deleteTopic = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_TOPIC_NAME);

        const t = await sequelize.transaction();
        try {
            const id_topic = req.params.topicId;

            const topic = await TopicForum.findByPk(id_topic);

            const forum = await Forum.findByPk(topic.id_forum);
            const total_topic = forum.total_topic - 1;
            await forum.update({ total_topic }, { transaction: t });

            await topic.destroy({ transaction: t });

            await t.commit()

            await index.deleteObject(id_topic);

            res.status(200).json({
                message: "Topic has been deleted",
                id: id_topic
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }
}


module.exports = new TopicForumController();