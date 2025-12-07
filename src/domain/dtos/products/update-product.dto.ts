import { UploadedFile } from "express-fileupload";
import { validatorAdapter } from "../../../config/validator.adapter";

export class UpdateProductDto {

    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly lastPrice: number,
        public readonly materials: string,
        public readonly cautions: string,
        public readonly id: string,
        public readonly img?: UploadedFile,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateProductDto?] {

        const { name, description, price, lastPrice, materials, cautions, id, img = null } = object;

        if (!name) return ['El nombre del producto es requerido'];
        if (!description) return ['La descripción del producto es requerida'];
        if (!price || price <= 0 || isNaN(price)) return ['Ingrese un precio válido'];
        if (!lastPrice || lastPrice <= 0 || isNaN(lastPrice)) return ['Ingrese un precio anterior válido'];
        if (!materials) return ['Los materiales son obligatorios'];
        if (!cautions) return ['Las precauciones son obligatorias'];
        if (!validatorAdapter.isValidMongoId(id)) return ['Debe agregar un id válido de producto'];

        return [undefined, new UpdateProductDto(name, description, price, lastPrice, materials, cautions, id, img)];

    }

}