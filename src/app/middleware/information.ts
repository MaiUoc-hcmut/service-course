import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');


class CheckingInformation {
    checkGetTeacherInfor = async (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (req.authority === 0) return next();

            const id_user = req.user?.user.data.id;
            const id_teacher = req.params.teacherId;
            const role = req.user?.role;

            if (id_user === id_teacher) {
                req.authority = 3;
                return next();
            }

            if (role === "admin") {
                req.authority = 2;
                return next();
            }

            req.authority = 1;
            next();
        } catch (error: any) {
            console.log(error.message);
            next(createError.InternalServerError(error.message));
        }
    }
}


module.exports = new CheckingInformation();