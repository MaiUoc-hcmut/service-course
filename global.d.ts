declare global {
    namespace Express {
        interface Request {
            teacher?: any;
        }
    }
    
    interface RequestWithFile extends Request {
        file: Express.Multer.File;
        files: Express.Multer.File[];
    }

    namespace Express.Multer {
        interface File {
            thumbnail: Express.Multer.File;
            cover: Express.Multer.File;
        }
    }
}

const formdata = new FormData();
let video = "GT12.mp4";
video = "2-" + "3-" + video;

const io = require('socket.io')(server); // Đảm bảo rằng bạn đã khởi tạo server

uploadLectureVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const urls: ResponseVideoFile[] = [];

        const uploadPromises = files.video.map(async (video) => {
            const dateTime = fileUpload.giveCurrentDateTime();

            const firstHyphen = video.originalname.indexOf('-');
            const chapterIdx = video.originalname.substring(0, firstHyphen);

            const secondHyphen = video.originalname.indexOf('-', firstHyphen + 1);
            const lectureIdx = video.originalname.substring(firstHyphen + 1, secondHyphen);

            const originalFileName = video.originalname.substring(secondHyphen + 1);

            const storageRef = ref(
                storage, 
                `video course/${originalFileName + "       " + dateTime}`
            );

            const metadata = {
                contentType: video.mimetype,
            };

            // Tạo một tác vụ tải lên
            const uploadTask = storageRef.put(video.buffer, metadata);

            // Theo dõi tiến trình tải lên
            uploadTask.on('state_changed', 
                (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    // Gửi sự kiện 'upload-progress' cùng với tiến trình tải lên
                    io.emit('upload-progress', { fileName: originalFileName, progress });
                }, 
                (error) => {
                    console.log(error);
                }, 
                async () => {
                    const url = await uploadTask.snapshot.ref.getDownloadURL();
                    const duration = await Math.floor(getVideoDurationInSeconds(url));

                    urls.push({
                        name: originalFileName,
                        url,
                        chapterIdx: parseInt(chapterIdx),
                        lectureIdx: parseInt(lectureIdx),
                        duration
                    });
                    // Gửi sự kiện 'upload-complete' cùng với thông tin video
                    io.emit('upload-complete', { fileName: originalFileName, url });
                }
            );
        });
        
        await Promise.all(uploadPromises);

        req.lectureURL = urls;
        next();
    } catch (error: any) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}


export {};