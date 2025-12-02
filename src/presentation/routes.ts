import { Router, type Request, type Response } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';
import { ProductRoutes } from './products/routes';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();

    //User
    router.use('/api/auth', AuthRoutes.routes);

    //Categories
    router.use('/api/category', CategoryRoutes.routes);

    //Product
    router.use('/api/product', ProductRoutes.routes);

    return router;
  }


}

