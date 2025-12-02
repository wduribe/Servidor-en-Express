import { Router } from "express";
import { ProductController } from "./controller";
import { ProductService } from "./service";



export class ProductRoutes {

    static get routes(): Router {
        const routes = Router();

        const productService = new ProductService();
        const productController = new ProductController(productService);

        routes.get('/', productController.getProducts);

        

        return routes;
    }

}