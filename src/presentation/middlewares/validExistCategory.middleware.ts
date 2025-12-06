import { NextFunction, Request, Response } from "express";
import { validatorAdapter } from "../../config/validator.adapter";
import { CategoryModel, ICategory } from "../../database/models/category.model";

declare global {
    namespace Express {
        interface Request {
            category: ICategory
        }
    }
}

export const validExistCategory = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.categoryId;

    if (!validatorAdapter.isValidMongoId(id)) return res.status(401).json({ error: 'Id de categoria inválido' });

    const category = await CategoryModel.findById(id);
    if (!category) return res.status(401).json({ error: 'No hay categorias con el id de búsqueda' });

    req.category = category;

    next();

}