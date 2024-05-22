const Document = require('../../db/models/document');
const Course = require('../../db/models/course');
const Chapter = require('../../db/models/chapter');
const Topic = require('../../db/models/topic');
const CourseDraft = require('../../db/models/course_draft');

const { ref, getDownloadURL, uploadBytes, getStorage } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('../../config/firebase/firebase');
const DocumentFile = require('../../config/firebase/file');

import { Request, Response, NextFunction } from "express";
const dotenv = require('dotenv').config();

const { sequelize } = require('../../config/db/index');

declare global {
    namespace Express {
        interface Request {
            teacher?: any;
        }
    }
}

type ResponseUploadFile = {
    name: string,
    url: string,
}

interface RequestWithFile extends Request {
    file: Express.Multer.File;
    files: Express.Multer.File[];
}


initializeApp(firebaseConfig);

class DocumentController {
    // [GET] /api/v1/document
    getAllDocuments = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const documents = await Document.findAll();
            res.status(200).json(documents);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/:documentId
    getDocumentById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const docId = req.params.documentId;
            const document = await Document.findByPk(docId);
            if (!document) return res.status(404).json({ message: "Document not found!" });

            res.status(200).json(document);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/teacher/:teacherId
    getDocumentCreatedByTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const teacherId = req.params.teacherId;
            const teacherAuthId = req.teacher.data.id;
            if (teacherId != teacherAuthId)
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            const documents = await Document.findAll({
                where: { id_teacher: teacherId }
            });

            res.status(200).json(documents);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/folder/:parentId/
    getDocumentBelongToFolder = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const parentId = req.params.parentId;
            console.log(parentId)
            let idToFind = null;

            if (parseInt(parentId, 10) > 0) idToFind = parentId;

            const documents = await Document.findAll({
                where: { parent_folder_id: idToFind }
            });

            res.status(200).json(documents);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/:courseId
    getDocumentBelongToCourse = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            // const courseId = req.params.courseId;
            // const course = await Course.findByPk(courseId);
            // if (!course) return res.status(404).send("Course not found!");


        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/:chapterId
    getDocumentBelongToChapter = async (req: Request, res: Response, _next: NextFunction) => {
        try {

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/document/:topicId
    getDocumentBelongToTopic = async (req: Request, res: Response, _next: NextFunction) => {
        try {

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /api/v1/document
    createDocument = async (req: RequestWithFile, res: Response, _next: NextFunction) => {
        let data = req.body.data;
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        const t = await sequelize.transaction();
        try {
            const id_teacher = "92042d2b-3dee-4176-a62a-81c5e971bc16"; //req.teacher.data.id;
            const { id_course } = data;
            const file = req.file;

            // originalname of video is separate to 3 part
            // each part separate by a hyphen
            // first part is index of chapter in course, second part is index of topic in chapter
            const firstHyphen = file.originalname.indexOf('-');
            const chapterIdx = file.originalname.substring(0, firstHyphen);

            const secondHyphen = file.originalname.indexOf('-', firstHyphen + 1);
            const topicIdx = file.originalname.substring(firstHyphen + 1, secondHyphen);

            const originalFileName = file.originalname.substring(secondHyphen + 1);

            const storage = getStorage();

            const dateTime = DocumentFile.giveCurrentDateTime();

            const storageRef = ref(storage, `document/${file.originalname + "       " + dateTime}`)

            // Create file metadata including the content type
            const metadata = {
                contentType: file.mimetype,
            };

            const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
            const url = await getDownloadURL(snapshot.ref);

            const newDocument = await Document.create({ url, name: originalFileName, id_teacher });

            // check if the course is created or not
            const course = await Course.findByPk(id_course);

            // If course is not created yet
            if (!course) {
                console.log(newDocument.id);
                await CourseDraft.create({
                    url,
                    topic_order: topicIdx,
                    chapter_order: chapterIdx,
                    id_course,
                    id_document: newDocument.id,
                    type: "document"
                }, {
                    transaction: t
                });
            } else {
                const chapter = await Chapter.findOne({
                    where: {
                        id_course,
                        order: chapterIdx
                    }
                });

                const topic = await Topic.findOne({
                    where: {
                        id_chapter: chapter.id,
                        order: topicIdx
                    }
                });

                await topic.addDocument(newDocument, {
                    transaction: t
                });
            }

            await t.commit()

            res.status(201).json(newDocument);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }

    // [POST] /api/v1/document/update
    updateDocumentForTopic = async (req: RequestWithFile, res: Response, _next: NextFunction) => {
        let data = req.body.data;
        if (typeof data === "string") {
            data = JSON.parse(data);
        }
        const t = await sequelize.transaction();
        try {
            const id_teacher = "3ecfcb3b-edfd-46c7-a216-899fd5bb488e"; //req.teacher.data.id;
            const { id_course, id_topic } = data;
            const file = req.file;

            // originalname of video is separate to 3 part
            // each part separate by a hyphen
            // first part is index of chapter in course, second part is index of topic in chapter
            const originalFileName = file.originalname;

            const storage = getStorage();

            const dateTime = DocumentFile.giveCurrentDateTime();

            const storageRef = ref(storage, `document/${file.originalname + "       " + dateTime}`)

            // Create file metadata including the content type
            const metadata = {
                contentType: file.mimetype,
            };

            const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
            const url = await getDownloadURL(snapshot.ref);

            const newDocument = await Document.create({ url, name: originalFileName, id_teacher });

            // check if the course is created or not
            const course = await Course.findByPk(id_course);

            // If course is not created yet
            if (!course) {
                return res.status(404).json({
                    message: "The course you want to update is not exist!"
                });
            } else {
                const topic = await Topic.findByPk(id_topic);

                if (!topic) {
                    await CourseDraft.create({
                        url,
                        id_topic,
                        id_document: newDocument.id,
                        type: "document"
                    }, {
                        transaction: t
                    });

                    await t.commit();

                    return res.status(200).json({
                        message: "Document has been uploaded to cloud!"
                    });
                }

                await topic.addDocument(newDocument, { transaction: t });
            }

            await t.commit()

            res.status(201).json(newDocument);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });

            await t.rollback();
        }
    }

    createMultiDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const id_teacher = req.teacher.data.id;

            const documentsData = req.body
            let parentId = null;

            if (documentsData.parentId > 0) {
                parentId = documentsData.parentId;
            }

            let createdDocuments = [];

            for (const body of documentsData) {
                const newDocument = await Document.create({
                    name: body.name,
                    url: body.url,
                    parent_folder_id: parentId,
                    id_teacher
                });

                createdDocuments.push(newDocument);
            }

            return res.status(201).json(createdDocuments);

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    uploadFile = async (req: RequestWithFile, res: Response, _next: NextFunction) => {
        try {
            const storage = getStorage();

            const dateTime = DocumentFile.giveCurrentDateTime();

            const storageRef = ref(storage, `document/${req.file.originalname + "       " + dateTime}`)

            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };

            const snapshot = await uploadBytes(storageRef, req.file.buffer, metadata);
            const url = await getDownloadURL(snapshot.ref);

            res.status(200).send(url);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    uploadMultiFile = async (req: RequestWithFile, res: Response, _next: NextFunction) => {
        try {
            const storage = getStorage();

            const urls: ResponseUploadFile[] = [];

            const uploadPromises = req.files.map(async (file) => {
                const dateTime = DocumentFile.giveCurrentDateTime();
                const storageRef = ref(storage, `document/${file.originalname + "       " + dateTime}`)

                // Create file metadata including the content type
                const metadata = {
                    contentType: file.mimetype,
                };

                const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
                const url = await getDownloadURL(snapshot.ref);
                urls.push({
                    name: file.originalname,
                    url
                })
            });

            await Promise.all(uploadPromises);

            res.status(200).send(urls);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [PUT] /api/v1/document/:documentId
    updateDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const body = req.body;

            const documentId = req.params.documentId;

            const updatedDocument = Document.findByPk(documentId);
            const teacherId = updatedDocument.id_teacher;
            if (teacherId !== req.teacher.data.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });
            updatedDocument.update(body);

            res.status(200).json(updatedDocument);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /api/v1/document/:documentId
    deleteDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const documentId = req.params.documentId;

            const document = await Document.findByPk(documentId);
            if (!document) return res.status(404).json({ message: "Document does not exist!" });

            const teacherId = document.id_teacher;

            if (teacherId !== req.teacher.data.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            await document.destroy();

            res.status(200).json({
                message: "Document has been deleted",
                documentId
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /api/v1/document
    deleteMultiDocument = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { teacherId } = req.body;
            if (teacherId !== req.teacher.data.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });
            const documentIds = req.body.documentIds;
            const existingId = await Document.findAll({
                where: { id: documentIds }
            }).map((document: any) => document.id)
            await Document.destroy({ where: { id: existingId } });

            res.status(200).json({ message: "All selected document have been deleted!" });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new DocumentController();