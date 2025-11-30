import { Types } from "mongoose";
import { CategoryModel } from "../../database/models/category.model";
import { CustomError } from "../../domain/error/error";







export class CategoryService {

    constructor() { }

    async getCategories() {
        try {
            const categories = await CategoryModel.find();
            return categories;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategoryById(id: string) {
        try {
            const category = await CategoryModel.findById(id);
            if (!category) return CustomError.badRequest('No existe una categoria relacionada con el páramtro de búsqueda');

            return category;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }


    async createCategory(name: string, userId: Types.ObjectId) {

        try {

            const existCategory = await CategoryModel.findOne({ name });
            if (existCategory) return CustomError.badRequest('Ya existe una categoria con este nombre');

            const category = new CategoryModel({ name });
            category.user = userId;

            await category.save();

            return category;
            
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

}