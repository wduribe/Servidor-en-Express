import { Request, Response } from "express";
import { OrderService } from "./service";
import { CreateOrderDto } from "../../domain/dtos/orders/create-order.dto";
import { CustomError } from "../../domain/error/error";



export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    //Methods
    createOrder = (req: Request, res: Response) => {
        const [error, createOrderDto] = CreateOrderDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.orderService.createOrder(createOrderDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }


}