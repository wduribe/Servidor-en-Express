import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';
import { ProductRoutes } from './products/routes';
import { OrderRoutes } from './orders/routes';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();

    //User
    router.use('/api/auth', AuthRoutes.routes);

    //Categories
    router.use('/api/category', CategoryRoutes.routes);

    //Product
    router.use('/api/product', ProductRoutes.routes);

    //Order
    router.use('/api/order', OrderRoutes.routes);

    return router;
  }


}

