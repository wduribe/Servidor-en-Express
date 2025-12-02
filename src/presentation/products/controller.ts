import { Request, Response } from "express";
import { ProductService } from "./service";




export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) { }

    getProducts = (req: Request, res: Response) => {
        res.send('Hola Mundo');
    }

    createProduct = (req: Request, res: Response) => {
        
    }

}