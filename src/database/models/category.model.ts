import { Document, model, Schema, Types } from "mongoose";

interface ICategory extends Document {
    id: Types.ObjectId,
    name: string,
    available: boolean,
    user: Types.ObjectId,
}

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete (ret as any)._id;
        return ret;
    }
});

export const CategoryModel = model<ICategory>('Category', categorySchema);