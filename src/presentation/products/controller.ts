import { Request, Response } from "express";
import { ProductService } from "./service";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { CustomError } from "../../domain/error/error";




export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    getProducts = (req: Request, res: Response) => {
        res.send('Hola Mundo');
    }

    createProduct = (req: Request, res: Response) => {

        const [error, createProductDto] = CreateProductDto.create({
            ...req.body,
            category: req.category.id,
            user: req.user.id,
            img: req.files?.file
        });

        if (error) {
            res.status(401).json({ error });
            return;
        }

        this.productService.createProduct(createProductDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

}