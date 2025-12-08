import { Router } from 'express';
import { OrderController } from './controller';
import { OrderService } from './service';

export class OrderRoutes {

    static get routes(): Router {

        const router = Router();

        const orderService = new OrderService();
        const orderController = new OrderController(orderService);

        //Rutas
        router.post('/create', orderController.createOrder);

        return router;
    }


}