import { Cloudinary } from "../../config/cloudinary.adapter";
import { ProductModel } from "../../database/models/product.model";
import { CreateProductDto } from "../../domain/dtos/products/create-product.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CustomError } from "../../domain/error/error";
import { UpdateProductDto } from "../../domain/dtos/products/update-product.dto";

interface GetProductsByCategoryProps {
    categoryId: string,
    page: number,
    limit: number,
}

export class ProductService {

    constructor(
        private readonly cloudinary: Cloudinary
    ) { }

    async getProducts(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {

            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                //.populate('category')
            ]);

            return {
                page,
                limit,
                total,
                products
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProductById(id: string) {
        try {

            const product = await ProductModel.findById(id);
            if (!product) throw CustomError.badRequest('No existe el producto');

            return product;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async createProduct(createProductDto: CreateProductDto) {
        try {

            const { img, ...newProduct } = createProductDto;

            const product = new ProductModel(newProduct);

            const imgCloudinary = await this.cloudinary.uploadImage(createProductDto.img.data);
            if (!imgCloudinary) throw CustomError.internalServer('Error mientras se cargaba la iamgen');

            product.img.url = imgCloudinary.url;
            product.img.publicId = imgCloudinary.publicId;

            await product.save();

            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async updateProduct(updateProductDto: UpdateProductDto) {

        try {

            const product = await ProductModel.findById(updateProductDto.id)
            if (!product) throw CustomError.badRequest('El producto no existe');

            product.name = updateProductDto.name;
            product.description = updateProductDto.description;
            product.price = updateProductDto.price;
            product.lastPrice = updateProductDto.lastPrice;
            product.materials = updateProductDto.materials;
            product.cautions = updateProductDto.cautions;

            if (updateProductDto.img) {

                await this.cloudinary.deleteImage(product.img.publicId);

                const imgCloudinary = await this.cloudinary.uploadImage(updateProductDto.img.data);
                if (!imgCloudinary) throw CustomError.internalServer('Error mientras se cargaba la iamgen');

                product.img.url = imgCloudinary.url;
                product.img.publicId = imgCloudinary.publicId;

                //es una función de Mongoose que le dice manualmente a Mongoose que un campo fue modificado, cuando Mongoose NO puede detectarlo por sí mismo.
                product.markModified('img');

            }

            await product.save();

            return 'Producto actualizado correctamente';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteProduct(id: string) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) throw CustomError.badRequest('No existe el producto');

            await this.cloudinary.deleteImage(product.img.publicId);
            await product.deleteOne();

            return 'Producto eliminado correctamente';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProductsByCategory({ categoryId, page, limit }: GetProductsByCategoryProps) {

        const [total, products] = await Promise.all([
            ProductModel.countDocuments({ category: categoryId }),
            ProductModel.find({ category: categoryId })
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        if (total === 0) throw CustomError.badRequest('No existen productos relacionados con el Id de la categoria');

        return {
            page,
            limit,
            total,
            products
        }
    }


}
