import { Router } from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";
import { Validator } from "../middlewares/validator.middleware";
import { validExistCategory } from "../middlewares/validExistCategory.middleware";


export class CategoryRoutes {

    static get routes(): Router {
        const routes = Router();

        const categoryService = new CategoryService();
        const categoryController = new CategoryController(categoryService);

        //* Crear rutas
        routes.get('/', categoryController.getCategories);
        routes.get('/:id', categoryController.getCategoryById);

        //*Rutas protegidas
        routes.post('/', [Validator.validateToken, Validator.validateRole], categoryController.createCategory);
        routes.put('/:categoryId', [Validator.validateToken, Validator.validateRole, validExistCategory], categoryController.updateCategory);
        routes.delete('/:categoryId', [Validator.validateToken, Validator.validateRole, validExistCategory], categoryController.deleteCategory);

        return routes;
    }


}