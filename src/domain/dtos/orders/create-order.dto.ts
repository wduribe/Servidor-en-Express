import { Types } from "mongoose";
import { regularExps } from "../../../config/regular-express.adapter";
import { CartItems, Direction, PaymentMethodType } from "../../../database/models/order.model";

interface CreateOrder {
    user?: Types.ObjectId,
    direction: Direction,
    cartItems: CartItems[],
    paymentMethod: PaymentMethodType
}

const validPayment = ["CARD", "TRANSFER", "PAYPAL"];

export class CreateOrderDto {

    constructor(
        public readonly order: CreateOrder
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateOrderDto?] {
        const { user = null, direction, cartItems, paymentMethod } = object;

        if (!regularExps.email.test(direction.email)) return ['Debe ingresar un correo valido'];
        if (!direction.name) return ['El nombre del destinatario es obligatorio'];
        if (!direction.street) return ['La dirección del destinatario es obligatoria'];
        if (!direction.city) return ['La ciudad de destino es obligatoria'];
        if (!direction.country) return ['El pais de destino es obligatoria'];
        if (!direction.zipCode) return ['El codigo postal de destino es obligatorio'];
        if (!regularExps.phone.test(direction.phone)) return ['Debe ingresar un numero de celular válido'];
        if (!direction.comments) return ['Las instruciones son obligatorias'];

        const validCart = cartItems.map((product: CartItems) => {
            if (!product.name || !product.cant || !product.unitPrice || !product.subTotal || isNaN(product.subTotal) || isNaN(product.unitPrice) || isNaN(product.subTotal)) return false;
            return true;
        });

        if (!validCart[0]) return ['Items en el carrito no validos para la orden'];

        if (!validPayment.includes(paymentMethod)) return ['Debe ingresar un metodo de pago válido'];

        return [undefined, new CreateOrderDto({ user, direction, cartItems, paymentMethod })];
    }

}