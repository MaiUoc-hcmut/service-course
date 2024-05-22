const CourseDraft = require('../../db/models/course_draft');
import { Request, Response, NextFunction } from 'express';

const fileUpload = require('../../config/firebase/fileUpload');
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

class ImageController {

    // [POST] /images
    uploadImageWithBody = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const file = req.file;

            let resUrl = ""

            if (!file) {
                return res.status(404).json({
                    message: "Can not find file!"
                });
            }

            const dateTime = fileUpload.giveCurrentDateTime();

            let body = req.body.data;
            if (typeof (body) === "string") {
                body = JSON.parse(body);
            }

            const { id_course, type } = body;

            const storageRef = ref(
                storage,
                `${type}/${file?.originalname + '       ' + dateTime}`
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
            resUrl = downloadURL;

            await CourseDraft.create({
                id_course,
                url: resUrl,
                chapter_order: 0,
                topic_order: 0,
                type
            });

            res.status(200).json({ url: resUrl });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /images/single
    uploadSingleImage = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const file = req.file;

            if (!file) {
                return res.status(404).json({
                    message: "Can not find file!"
                });
            }

            const dateTime = fileUpload.giveCurrentDateTime();

            const storageRef = ref(
                storage,
                `images/${file?.originalname + '       ' + dateTime}`
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

            res.status(200).json({ url: downloadURL });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error, message: error.message });
        }
    }
}

module.exports = new ImageController();