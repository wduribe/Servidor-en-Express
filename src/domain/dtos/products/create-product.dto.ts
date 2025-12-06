import { Types } from "mongoose";
import { validatorAdapter } from "../../../config/validator.adapter";
import { UploadedFile } from "express-fileupload";

export class CreateProductDto {

    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly lastPrice: number,
        public readonly materials: string,
        public readonly cautions: string,
        public readonly category: Types.ObjectId,
        public readonly user: Types.ObjectId,
        public readonly img: UploadedFile,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateProductDto?] {
        const { name, description, price, lastPrice, materials, cautions, category, user, img } = object;

        if (!name) return ['El nombre del producto es requerido'];
        if (!description) return ['La descripción del producto es requerida'];
        if (!price || price <= 0 || isNaN(price)) return ['Ingrese un precio válido'];
        if (!lastPrice || lastPrice <= 0 || isNaN(lastPrice)) return ['Ingrese un precio anterior válido'];
        if (!materials) return ['Los materiales son obligatorios'];
        if (!cautions) return ['Las precauciones son obligatorias'];
        if (!validatorAdapter.isValidMongoId(category)) return ['Id incorrecto para la categoria'];
        if (!validatorAdapter.isValidMongoId(user)) return ['Id incorrecto para el usuario'];
        if (!img) return ['La imagen es requerida para el producto'];
        
        return [undefined, new CreateProductDto(
            name,
            description,
            price,
            lastPrice,
            materials,
            cautions,
            category,
            user,
            img
        )];

    }

}