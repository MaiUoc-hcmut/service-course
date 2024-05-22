const coursesRouter = require("./courses");
const commentsRouter = require("./comments");
const documentRouter = require('./document');
const folderRouter = require('./folders');
const chapterRouter = require('./chapters');
const topicRouter = require('./topic');
const categoryRouter = require('./category');
const parentCategoryRouter = require('./par-category');
const reviewRouter = require('./review');
const imageRouter = require('./image');
const videoRouter = require('./video');
const progressRouter = require('./progress');
const forumRouter = require('./forum');
const topicForumRouter = require('./topicforum');
const answerRouter = require('./answer');
const informationRouter = require('./information');
const couponRouter = require('./coupon');
const testRouter = require('./test');

function route(app: any) {
    app.use("/api/v1/courses", coursesRouter);
    app.use("/api/v1/chapters", chapterRouter);
    app.use("/api/v1/topics", topicRouter);
    app.use("/api/v1/comments", commentsRouter);
    app.use('/api/v1/document', documentRouter);
    app.use('/api/v1/folder', folderRouter);
    app.use('/api/v1/categories', categoryRouter);
    app.use('/api/v1/par-categories', parentCategoryRouter);
    app.use('/api/v1/reviews', reviewRouter);
    app.use('/api/v1/images', imageRouter);
    app.use('/api/v1/videos', videoRouter);
    app.use('/api/v1/progresses', progressRouter);
    app.use('/api/v1/forums', forumRouter);
    app.use('/api/v1/topicsforum', topicForumRouter);
    app.use('/api/v1/answers', answerRouter);
    app.use('/api/v1/informations', informationRouter);
    app.use('/api/v1/coupons', couponRouter);
    app.use('/api/v1/test', testRouter);
}

module.exports = route;
