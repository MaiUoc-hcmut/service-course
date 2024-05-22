const Forum = require('../../db/models/forum');
const TopicForum = require('../../db/models/topicforum');
const Answer = require('../../db/models/answer'); 

const FileUpload = require('../../config/firebase/fileUpload');

import { Request, Response, NextFunction } from 'express';

const { sequelize } = require('../../config/db/index');

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

class AnswerController {

    // [POST] /answers
    createAnswer = async (req: Request, res: Response, _next: NextFunction) => {
        let body = req.body.data;

        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const t = await sequelize.transaction();
        try {
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            const topic = await TopicForum.findByPk(body.id_topic_forum);

            const forum = await Forum.findByPk(topic.id_forum);

            const total_topic_answer = topic.total_answer + 1;
            const total_forum_answer = forum.total_answer + 1;

            await topic.update({ total_answer: total_topic_answer }, { transaction: t });
            await forum.update({ total_answer: total_forum_answer }, { transaction: t });

            const answer = await Answer.create({
                id_user,
                role,
                file: req.ImageUrl,
                ...body
            }, {
                transaction: t
            });

            await t.commit();

            res.status(201).json(answer);
            
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
                    `answer topic/${file?.originalname + '       ' + dateTime}`
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

    // [DELETE] /answers/:answerId
    deleteAnswer = async (req: Request, res: Response, _next: NextFunction) => {
        const t = await sequelize.transaction();
        try {
            const id_answer = req.params.answerId;

            const answer = await Answer.findByPk(id_answer);

            const topic = await TopicForum.findByPk(answer.id_topic_forum);
            const forum = await Forum.findByPk(topic.id_forum);

            const total_topic_answer = topic.total_answer - 1;
            const total_forum_answer = forum.total_answer - 1;

            await topic.update({ total_answer: total_topic_answer }, { transaction: t });
            await forum.update({ total_answer: total_forum_answer }, { transaction: t });

            await answer.destroy({ transaction: t });

            await t.commit();

            res.status(200).json({
                message: "Answer has been deleted!",
                id: id_answer
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }
}

module.exports = new AnswerController();