const Topic = require('../../db/models/topic')
const Chapter = require('../../db/models/chapter')
import { Request, Response, NextFunction } from "express";
const { getVideoDurationInSeconds } = require('get-video-duration');

const progress = require('progress-stream');

const io = require('../../index');
const clientsConnected = require('../../socket');

const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig, storage } = require('../../config/firebase/firebase');
const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    getStorage,
} = require('firebase/storage');
const { initializeApp } = require('firebase/app');

initializeApp(firebaseConfig);
// const storage = getStorage();

class TopicController {

    // [GET] /topics
    getAllTopics = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const topics = await Topic.findAll();

            res.status(200).json(topics);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /topics/:topicId
    getTopicById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id = req.params.topicId;

            const topic = await Topic.findByPk(id);

            res.status(200).json(topic);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /topics/chapter/:chapterId
    getTopicBelongToChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const chapterId = req.params.chapterId;

            const topics = await Topic.findAll({
                where: { id_chapter: chapterId }
            });

            res.status(200).json(topics);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [GET] /topics/check/exam/:examId
    getTopicByExam = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_exam = req.params.examId;

            const topic = await Topic.findOne({
                where: {
                    id_exam
                }
            });

            if (!topic) {
                return res.status(200).json({
                    id_topic: null
                });
            }

            res.status(200).json({
                id_topic: topic.id
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).send(error.message);
        }
    }

    // [POST] /topics
    createTopic = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const body = req.body;

            const topicURL = req.topicURL[0];

            const newTopic = await Topic.create({
                video: topicURL.url,
                duration: topicURL.duration,
                ...body
            });

            res.status(201).json(newTopic);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    uploadTopicVideo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const urls: ResponseVideoFile[] = [];

            const uploadPromises = files.video.map(async (video) => {
                const dateTime = fileUpload.giveCurrentDateTime();

                // originalname of video is separate to 3 part
                // each part separate by a hyphen
                // first part is index of chapter in course, second part is index of topic in chapter
                const firstHyphen = video.originalname.indexOf('-');
                const chapterIdx = video.originalname.substring(0, firstHyphen);

                const secondHyphen = video.originalname.indexOf('-', firstHyphen + 1);
                const topicIdx = video.originalname.substring(firstHyphen + 1, secondHyphen);

                const originalFileName = video.originalname.substring(secondHyphen + 1);

                const storageRef = ref(
                    storage,
                    `video course/${originalFileName + "       " + dateTime}`
                );

                const metadata = {
                    contentType: video.mimetype,
                };

                const snapshot = await uploadBytesResumable(storageRef, video.buffer, metadata);
                const url = await getDownloadURL(snapshot.ref);
                const duration = await Math.floor(getVideoDurationInSeconds(url));

                urls.push({
                    name: originalFileName,
                    url,
                    chapterIdx: parseInt(chapterIdx),
                    topicIdx: parseInt(topicIdx),
                    duration
                });
                io.to(clientsConnected[req.teacher.data.id]).emit("file uploaded", {
                    fileName: originalFileName,
                    url
                })
            });

            await Promise.all(uploadPromises);

            req.topicURL = urls;
            next();
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [PUT] /topics/:topicId
    updateTopic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;

            const topic = await Topic.update(body, {
                where: { id: req.params.topicId }
            });

            res.status(200).json(topic);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    // [DELETE] /topics/:topicId
    deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Topic.destroy({
                where: { id: req.params.topicId }
            });

            res.status(200).json({
                id: req.params.topicId,
                message: "Topic has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    test = async (req: Request, res: Response) => {
        try {
            const file: any = req.file;
            const progressStream = progress({
                length: file.size,
                time: 100 /* ms */
            });

            progressStream.on('progress', (progress: any) => {
                console.log(`Upload progress: ${progress.percentage}%`);
            });

            const bucket = storage.bucket('video course');
            const blob = bucket.file(file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on('error', (err: any) => {
                console.error(err);
                res.status(500).end();
            });

            blobStream.on('finish', () => {
                console.log('Upload completed');
                res.status(200).end();
            });

            progressStream.pipe(blobStream);

            res.status(200).json({
                message: "Success"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new TopicController();
