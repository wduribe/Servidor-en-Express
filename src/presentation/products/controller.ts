import { Request, Response } from "express";
import { ProductService } from "./service";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { CustomError } from "../../domain/error/error";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { validatorAdapter } from "../../config/validator.adapter";
import { UpdateProductDto } from "../../domain/dtos/products/update-product.dto";




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

        const { page = 1, limit = 6 } = req.query;

        const [error, paginatioDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.productService.getProducts(paginatioDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

    getProductById = (req: Request, res: Response) => {
        const { id } = req.params;

        if (!validatorAdapter.isValidMongoId(id)) return res.status(400).json({ error: 'Ingrese un Id válido de producto' });

        this.productService.getProductById(id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

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

    updateProduct = (req: Request, res: Response) => {

        const [error, updateProductDto] = UpdateProductDto.create({
            ...req.body,
            id: req.params.id,
            img: req.files ? req.files.file : null
        });

        if (error) return res.status(400).json({ error });

        this.productService.updateProduct(updateProductDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

    deleteProduct = (req: Request, res: Response) => {
        const { id } = req.params;

        if (!validatorAdapter.isValidMongoId(id)) return res.status(400).json({ error: 'Ingrese un Id válido de producto' });

        this.productService.deleteProduct(id)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));
    }

    getProductsByCategory = (req: Request, res: Response) => {

        const { categoryId } = req.params;
        const { page = 1, limit = 6 } = req.query;

        const [error, paginatioDto] = PaginationDto.create(+page, +limit);

        if (!validatorAdapter.isValidMongoId(categoryId)) return res.status(400).json({ error: 'Ingrese un Id válido de categoria' });
        if (error) return res.status(400).json({ error });

        this.productService.getProductsByCategory({ categoryId, page: paginatioDto?.page!, limit: paginatioDto?.limit! })
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

}