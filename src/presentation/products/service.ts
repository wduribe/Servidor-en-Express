import { Cloudinary } from "../../config/cloudinary.adapter";
import { ProductModel } from "../../database/models/product.model";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { CustomError } from "../../domain/error/error";



export class ProductService {

    constructor(
        private readonly cloudinary: Cloudinary
    ) { }

    async getProducts() {

    }

    async createProduct(createProductDto: CreateProductDto) {
        try {

            const { img, ...newProduct } = createProductDto;

            const product = new ProductModel(newProduct);

            const imgCloudinary = await this.cloudinary.uploadImage(createProductDto.img.data);

            product.img.url = imgCloudinary.url;
            product.img.publicId = imgCloudinary.publicId;

            await product.save();

            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

}