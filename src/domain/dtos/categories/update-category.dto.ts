import { ICategory } from "../../../database/models/category.model";


export class UpdateCategoryDto {

    constructor(
        public readonly name: string,
        public category: ICategory,
    ) { }

    static create(objet: { [key: string]: any }): [string?, UpdateCategoryDto?] {
        const { name, category } = objet;

        if (!name) return ['El nombre de la categoria es requerido'];

        return [undefined, new UpdateCategoryDto(name, category)];

    }
}