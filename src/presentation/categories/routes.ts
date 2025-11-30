import { Router } from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "./service";
import { Validator } from "../middlewares/validator.middleware";


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

        return routes;
    }


}