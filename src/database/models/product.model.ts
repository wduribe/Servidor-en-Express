import { Document, model, Schema, Types } from "mongoose";
import { Img } from "./user.model";

export interface IProduct extends Document {
    name: string,
    description: string,
    available: boolean,
    price: number,
    lastPrice: number,
    materials: string,
    cautions: string,
    category: Types.ObjectId,
    user: Types.ObjectId,
    img: Img,
}

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    price: {
        type: Number,
        required: true,
    },
    lastPrice: {
        type: Number,
        required: true,
    },
    materials: {
        type: String,
        required: true,
    },
    cautions: {
        type: String,
        required: true,
    },
    img: {
        type: Object,
        default: {
            url: '',
            publicId: '',
        }
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

});

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete (ret as any)._id;
        return ret;
    }
});

export const ProductModel = model<IProduct>('Product', productSchema);