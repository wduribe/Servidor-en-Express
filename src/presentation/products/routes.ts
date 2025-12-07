import { Router } from "express";
import { ProductController } from "./controller";
import { ProductService } from "./service";
import { validExistCategory } from "../middlewares/validExistCategory.middleware";
import { Validator } from "../middlewares/validator.middleware";
import { fileUploadMiddleware } from "../middlewares/fileUpload.middleware";
import { Cloudinary } from "../../config/cloudinary.adapter";
import { envsAdapter } from "../../config/envs.adapter";
import { validExistFileInUpdateProduct } from "../middlewares/validExistFile.middleware";



export class ProductRoutes {

    static get routes(): Router {
        const routes = Router();

        const cloudinary = new Cloudinary({
            cloud_name: envsAdapter.CLOUD_NAME,
            api_key: envsAdapter.CLOUD_API_KEY,
            api_secret: envsAdapter.CLOUD_API_SECRET,
        });

        const productService = new ProductService(cloudinary);
        const productController = new ProductController(productService);

        routes.get('/', productController.getProducts);
        routes.get('/:id', productController.getProductById);

        //Rutas protegidas
        routes.post('/:categoryId', [Validator.validateToken, Validator.validateRole, validExistCategory, fileUploadMiddleware], productController.createProduct);
        routes.put('/:id', [Validator.validateToken, Validator.validateRole, validExistFileInUpdateProduct], productController.updateProduct);
        routes.delete('/:id', [Validator.validateToken, Validator.validateRole], productController.deleteProduct);

        return routes;
    }

}