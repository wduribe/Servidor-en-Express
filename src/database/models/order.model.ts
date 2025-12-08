import { model, Schema, Types } from "mongoose";

export interface Direction {
    email: string,
    name: string,
    street: string,
    city: string,
    country: string,
    zipCode: string,
    phone: string,
    comments: string,
}

export interface CartItems {
    name: string,
    cant: number,
    unitPrice: number,
    subTotal: number,
}

export type PaymentMethodType = "CARD" | "TRANSFER" | "PAYPAL";
type OrderStatusType = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type ShippingStatusType = "ENLISTMENT" | "DELIVERY_PROCESS" | "SUCCESSFUL_DELIVERY" | "RETURNED";

interface IOrder {
    id: Types.ObjectId,
    user: Types.ObjectId | null,
    orderNumber: string,
    direction: Direction,
    cartItems: CartItems[],
    paymentMethod: PaymentMethodType,
    orderStatus: OrderStatusType,
    totalAmount: number,
    shippingStatus: ShippingStatusType,
    shippingGuide: string,
    viewed: boolean,
}

const cartItemsSchema = new Schema({
    name: String,
    cant: Number,
    unitPrice: Number,
    subTotal: Number,
});

const directionSchema = new Schema({
    email: String,
    name: String,
    street: String,
    city: String,
    country: String,
    zipCode: String,
    phone: String,
    comments: String,
})

const orderSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: false,
        default: null,
    },
    orderNumber: {
        type: String,
        required: [true, 'El número del pedido es requerido'],
    },
    direction: {
        type: directionSchema,
        required: [true, 'Los datos de la dirección son requeridos'],
    },
    cartItems: {
        type: [cartItemsSchema],
        required: [true, 'Los items del carrito son requeridos'],
    },
    paymentMethod: {
        type: [String],
        enum: ["CARD", "TRANSFER", "PAYPAL"],
        required: [true, 'Debe seleccionar un metodo de pago']
    },
    orderStatus: {
        type: [String],
        default: ["PENDING"],
        enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
    },
    totalAmount: {
        type: Number,
        required: [true, 'El precio total del pedido es requerido'],
    },
    shippingStatus: {
        type: [String],
        default: ["ENLISTMENT"],
        enum: ["ENLISTMENT", "DELIVERY_PROCESS", "SUCCESSFUL_DELIVERY", "RETURNED"],
    },
    shippingGuide: {
        type: String,
        default: '',
    },
    viewed: {
        type: Boolean,
        default: false,
    }

});


orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete (ret as any)._id;
        return ret;
    }
});

directionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete (ret as any)._id;
        return ret;
    }
});

cartItemsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        delete (ret as any)._id;
        return ret;
    }
});

export const OrderModel = model<IOrder>('Order', orderSchema);