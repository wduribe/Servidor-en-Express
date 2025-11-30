import { Schema, Document, model, Types } from 'mongoose';

export interface IToken extends Document {
    token: string,
    user: Types.ObjectId,
    creadedAt: Date,
}

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    }
});


export const TokenModel = model<IToken>('Token', tokenSchema);