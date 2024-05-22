const TopicForum = require('../../db/models/topicForum');
const Forum = require('../../db/models/forum');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');

class CheckingTopic {
    checkCreateTopic = async (req: Request, _res: Response, next: NextFunction) => {
        let body = req.body.data;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        try {
            const { id_forum } = body;
            const forum = await Forum.findByPk(id_forum);
            if (!forum) {
                let error = "Forum does not exist!";
                return next(createError.BadRequest(error));
            }

            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkDeleteTopic = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_topic = req.params.topicId;
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            const topic = await TopicForum.findByPk(id_topic);
            if (!topic) {
                let error = "Topic does not exist!";
                return next(createError.BadRequest(error));
            }

            if (role !== "admin" && id_user !== topic.id_user) {
                let error = "You do not have permission to delete this topic";
                return next(createError.Unauthorized(error));
            }

            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkUpdateTopic = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id_topic = req.params.topicId;
            const id_user = req.user?.user.data.id;

            const topic = await TopicForum.findByPk(id_topic);
            if (!topic) {
                let error = "Topic does not exist!";
                return next(createError.BadRequest(error));
            }

            if (id_user !== topic.id_user) {
                let error = "You do not have permission to delete this topic";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingTopic();