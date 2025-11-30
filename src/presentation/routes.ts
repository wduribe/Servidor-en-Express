import { Router, type Request, type Response } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './categories/routes';

export class AppRoutes {

  static get routes(): Router {

    const router = Router();

    //User
    router.use('/api/auth', AuthRoutes.routes);

    //Category
    router.use('/api/category', CategoryRoutes.routes);

    return router;
  }


}

