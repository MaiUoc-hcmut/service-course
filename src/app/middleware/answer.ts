const TopicForum = require('../../db/models/topicForum');
const Answer = require('../../db/models/answer');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');


class CheckingAnswer {
    checkCreateAnswer = async (req: Request, _res: Response, next: NextFunction) => {
        let body = req.body.data;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        try {
            const { id_topic_forum, id_parent } = body;

            const topic = await TopicForum.findByPk(id_topic_forum);
            if (!topic) return next(createError.BadRequest("Topic does not exist"));

            if (id_parent) {
                const answer = await Answer.findByPk(id_parent);
                if (!answer) return next(createError.BadRequest("Parent answer does not exist"));

                if (answer.id_parent !== null && answer.id_parent !== "") {
                    let error = "Your parent answer is a child of another answer, means the answer you want to create cannot be a child of this answer";
                    return next(createError.BadRequest(error));
                }
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }

    checkDeleteAnswer = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const id_answer = req.params.answerId;
            const id_user = req.user?.user.data.id;
            const role = req.user?.role;

            const answer = await Answer.findByPk(id_answer);
            if (!answer) {
                let error = "Answer does not exist!";
                return next(createError.BadRequest(error));
            }
            if (role !== "admin" && id_user !== answer.id_user) {
                let error = "You does not have permission to delete this answer!";
                return next(createError.Unauthorized(error));
            }
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}

module.exports = new CheckingAnswer();