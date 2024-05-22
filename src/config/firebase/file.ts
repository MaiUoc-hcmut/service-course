const multer = require('multer');

class DocumentFile {
    upload = multer({ storage: multer.memoryStorage() }).single('document');

    uploadMulti = multer({ storage: multer.memoryStorage() }).array('document');

    giveCurrentDateTime = () => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date + ' ' + time;
        return dateTime;
    }

}

module.exports = new DocumentFile();