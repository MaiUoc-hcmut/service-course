import { Request, Response, NextFunction } from "express";
const fileUpload = require('../../config/firebase/fileUpload');
const { firebaseConfig } = require('../../config/firebase/firebase');

const progress = require('progress-stream');

const algoliasearch = require('algoliasearch');

const {
    ref,
    getDownloadURL,
    uploadBytesResumable,
    getStorage,
} = require('firebase/storage');

const { initializeApp } = require('firebase/app');

initializeApp(firebaseConfig);

const storage = getStorage();

require('dotenv').config();

class Test {
    testUploadFile = async (req: Request, res: Response) => {
        try {
            const file = req.file
    
            const dateTime = fileUpload.giveCurrentDateTime();

            if (file) {
                const firstHyphen = file.originalname.indexOf('-');
                const chapterIdx = file.originalname.substring(0, firstHyphen);

                const secondHyphen = file.originalname.indexOf('-', firstHyphen + 1);
                const lectureIdx = file.originalname.substring(firstHyphen + 1, secondHyphen);

                const originalFileName = file.originalname.substring(secondHyphen + 1);

                const storageRef = ref(
                    storage, 
                    `video course/${originalFileName + "       " + dateTime}`
                );

                const metadata = {
                    contentType: file.mimetype,
                };

                // Tạo một tác vụ tải lên
                const uploadTask = storageRef.put(file.buffer, metadata);

                // Theo dõi tiến trình tải lên
                uploadTask.on('state_changed', 
                    (snapshot: any) => {
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        // Gửi sự kiện 'upload-progress' cùng với tiến trình tải lên
                    }, 
                    (error: any) => {
                        console.log(error);
                    }, 
                    async () => {
                        const url = await uploadTask.snapshot.ref.getDownloadURL();
                        res.send(url);
                    }
                );
            }
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        }
    }

    testSearchEngineAlgolia = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

        try {
            const result = await index.search(req.query.query, {
                hitsPerPage: 10,
                page: 0
            });

            res.status(200).json({ res: result.hits, total: result.nbHits });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json(error);
        }
    }

    testSaveObjectAlgolia = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const dataToSend = {
                "id": "52e955f0-61f5-4474-bcf4-4d82b8266c3b",
                "id_teacher": "3ecfcb3b-edfd-46c7-a216-899fd5bb488e",
                "name": "Test for update data to algolia",
                "description": "This is description for dataToSend",
                "price": 0,
                "goal": "This is goal",
                "object": "This is object",
                "requirement": "This is requirement",
                "thumbnail": "",
                "cover_image": "",
                "status": "1",
                "total_lecture": 6,
                "total_exam": 0,
                "total_chapter": 2,
                "total_duration": 0,
                "average_rating": 4.33333,
                "total_review": 3,
                "createdAt": "2024-03-06T08:13:00.000Z",
                "updatedAt": "2024-03-06T10:09:20.000Z",
                "Categories": [
                    {
                        "name": "Math",
                        "id": "a42cf6a2-e3b1-4e18-978f-2dd4e8241697"
                    },
                    {
                        "name": "12",
                        "id": "f4b13cd2-5fa0-49c2-a589-498c241c798e"
                    },
                    {
                        "name": "Advanced",
                        "id": "d30af7f3-56cc-400d-9c9f-9a02e30f7321"
                    }
                ],
                "user": {
                    "id": "3ecfcb3b-edfd-46c7-a216-899fd5bb488e",
                    "name": "Mai Nguyen Uoc"
                },
                "objectID": "52e955f0-61f5-4474-bcf4-4d82b8266c3b"
            }

            const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
            const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

            await index.saveObject(dataToSend);
            res.json({message: "Data has been updated to algolia"})
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json(error);
        }
    }

    testLogHeader = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            res.json(req.headers);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json(error);
        }
    }

    testSearchCourseOfTeacher = async (req: Request, res: Response, _next: NextFunction) => {
        const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY);
        const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
        try {
            const filters = `id_teacher:${req.params.teacherId}`;
            const result = await index.search(req.query.query, {
                hitsPerPage: 10,
                page: 0,
                filters
            });

            res.status(200).json(result.hits);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json(error);
        }
    }

    testGetQuery = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { class: _class, subject: _subject, level: _level } = req.query;
        
            // Khởi tạo mảng để lưu trữ các giá trị của query
            const queryValues = [];

            // Kiểm tra và thêm giá trị của mỗi query vào mảng
            if (_class) queryValues.push(_class);
            if (_subject) queryValues.push(_subject);
            if (_level) queryValues.push(_level);

            // In ra mảng kết quả
            console.log(queryValues);

            // Trả về kết quả
            res.status(200).json({
                queryValues: queryValues
            });
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({
                message: error.message
            })
        }
    }
}

module.exports = new Test();