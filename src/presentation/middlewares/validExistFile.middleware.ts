import { NextFunction, Request, Response } from "express";


export const validExistFileInUpdateProduct = (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.files || !req.files.file) {
        return next();
    }

    if (Array.isArray(req.files.file)) return res.status(400).json({ error: 'Solo puede subir una imagen por producto' });

    const file = req.files.file;
    const formats = ['png', 'jpg', 'jpeg', 'webp'];
    const extention = file.mimetype.split('/').at(1) ?? '';

    if (!formats.includes(extention)) return res.status(400).json({ error: 'Debe ingresar un formato de imagen valido png, jpg, jpeg, webp' });

    next();
} 