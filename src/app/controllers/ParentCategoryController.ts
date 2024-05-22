const ParentCategory = require('../../db/models/parent-category');

import { Request, Response, NextFunction } from 'express';

class ParentCategoryController {
    
    // [GET] /par-categories
    getAllParentCategory = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const par_categories = await ParentCategory.findAll();

            res.status(200).json(par_categories);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /par-categories/:parentId
    getParentCategoryById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const parentCategory = await ParentCategory.findByPk(req.params.parentId);

            if (!parentCategory) return res.status(404).json({ message: "Parent category does not exist" });

            res.status(200).json(parentCategory);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /par-categories
    createParentCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { name } = req.body;

            const newParentCategory = await ParentCategory.create({ name });

            res.status(201).json(newParentCategory);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [PUT] /par-categories/:parentId
    updateParentCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { name } = req.body;
            
            const parent = await ParentCategory.findByPk(req.params.parentId);

            if(!parent) return res.status(404).json({ message: "Parent category does not exist" });

            const existedParent = await ParentCategory.findAll({
                where: { name }
            });

            if (existedParent.length > 0) return res.status(400).json({ message: "The parent category already exist" });

            await parent.update({ name });

            res.status(200).json(parent);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /par-categories/:parentId
    deleteParentCategory = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const parent = await ParentCategory.findByPk(req.params.parentId);

            if(!parent) return res.status(404).json({ message: "Parent category does not exist" });

            await parent.destroy();

            res.status(200).json({
                id: req.params.parentId,
                message: "Parent category has been deleted"
            })
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new ParentCategoryController();