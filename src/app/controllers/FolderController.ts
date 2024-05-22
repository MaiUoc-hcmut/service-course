import { Request, Response, NextFunction } from "express";
const Folder = require('../../db/models/folder');
const Document = require('../../db/models/document');

class FolderController {

    // [GET] /api/v1/folder
    getAllFolders = async (_req: Request, res: Response, _next: NextFunction) => {
        try {
            const folders = await Folder.findAll();
            res.status(200).json(folders);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/folder/:folderId
    getFolderById = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const folderId = req.params.folderId;
            const folder = await Folder.findByPk(folderId);
            if (!folder) return res.status(404).json({ message: "Folder not found!" });

            res.status(200).json(folder);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [GET] /api/v1/folder/getSubFolder/:parentId?
    getFoldersByParent = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            console.log('34');
            const parentId = req.params.parentId;
            let idToFind = null;
            if (parentId !== undefined) {
                idToFind = parentId;
            }
            const folders = await Folder.findAll({
                where: { parent_folder_id: idToFind }
            })
            res.status(200).json(folders);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /api/v1/folder/create/:parentId?
    createFolder = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const parentId = req.params.parentId;
            const id_teacher = req.teacher.data.id;
            const body = req.body;
            body.id_teacher = id_teacher;

            if (parentId !== undefined) {
                body.parent_folder_id = parentId;
            }

            const newFolder = await Folder.create(body);

            res.status(201).json(newFolder);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [POST] /api/v1/folder/copy/:parentId?
    copyFolder = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const { folderId } = req.body;
            const { parentId } = req.params;
            const id_teacher = req.teacher.data.id;

            const folder = await Folder.findByPk(folderId);
            if (id_teacher != folder.id_teacher) 
                return res.status(401).json({ message: "You do not have permission to do this action!"});

            const copiedFolder = await this.recCopy(folderId, +parentId);

            res.status(200).json(copiedFolder);

        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    recCopy = async (folderId: number, parentId: number) => {
        const folder = await Folder.findByPk(folderId);
        if (!folder) return -1;
        let realParentId = null;
        if (parentId > 0) realParentId = parentId;
        const newFolder = await Folder.create({
            name: folder.name,
            parent_folder_id: realParentId,
            id_teacher: folder.id_teacher
        })

        const documets = await Document.findAll({
            where: { parent_folder_id: folderId }
        })
        for (const doc of documets) {
            await Document.create({
                name: doc.name,
                url: doc.url,
                parent_folder_id: folderId,
                id_teacher: doc.id_teacher
            })
        }

        const subFolders = await Folder.findAll({
            where: { parent_folder_id: folderId }
        })
        for (const subFol of subFolders) {
            await this.recCopy(subFol.id, newFolder.id)
        }

        return newFolder;
    }

    // [PUT] /api/v1/folder/update/:folderId
    updateFolder = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const folderId = req.params.folderId;
            console.log(folderId);
            const id_teacher = req.teacher.data.id;
            const body = req.body;

            const folder = await Folder.findByPk(folderId);
            if (!folder) return res.status(404).json({ message: "Folder does not exist!"});

            if (id_teacher != folder.id_teacher) 
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            if (body.parent_folder_id && body.parent_folder_id === -1) {
                body.parent_folder_id = null;
            }

            await folder.update(body);

            res.status(200).json(folder);
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }

    // [DELETE] /api/v1/folder/:folderId
    deleteFolder = async (req: Request, res: Response, _next: NextFunction) => {
        try {
            const folderId = req.params.folderId;

            const folder = await Folder.findByPk(folderId);
            if (!folder) return res.status(404).json({ message: "Folder does not exist!"});

            const teacherId = folder.id_teacher;

            if (teacherId != req.teacher.data.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            await folder.destroy();

            res.status(200).json({ 
                message: "Folder has been deleted",
                folderId
            });
        } catch (error: any) {
            console.log(error.message);
            res.status(500).json({ error });
        }
    }
}

module.exports = new FolderController();