import { Request, Response } from "express";
import { CustomError } from "../../domain/error/error";
import { CategoryService } from "./service";
import { validatorAdapter } from "../../config/validator.adapter";
import { error } from "console";




export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    getCategories = (req: Request, res: Response) => {
        this.categoryService.getCategories()
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));
    }

    getCategoryById = (req: Request, res: Response) => {
        const { id } = req.params;

        if (!validatorAdapter.isValidMongoId(id)) {
            res.status(400).json('Id de búsqueda inválido');
            return;
        }

        this.categoryService.getCategoryById(id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

    createCategory = (req: Request, res: Response) => {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ error: 'El nombre de la categoria es requerido' });
            return;
        }

        this.categoryService.createCategory(name, req.user.id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }




}