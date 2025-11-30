import { isValidObjectId } from "mongoose";

export const validatorAdapter = {
    isValidMongoId: (id: string) => isValidObjectId(id),
}