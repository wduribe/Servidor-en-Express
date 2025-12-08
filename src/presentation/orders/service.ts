import { createOrderNumberAdapter } from "../../config/order-number.adapter";
import { OrderModel } from "../../database/models/order.model";
import { CreateOrderDto } from "../../domain/dtos/orders/create-order.dto";
import { CustomError } from "../../domain/error/error";



export class OrderService {
    constructor(

    ) { }

    //Methods
    async createOrder(createOrderDto: CreateOrderDto) {

        try {
            
            const order = new OrderModel(createOrderDto.order);

            order.orderNumber = createOrderNumberAdapter();
            order.totalAmount = 50000;

            await order.save();

            return order;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }
}