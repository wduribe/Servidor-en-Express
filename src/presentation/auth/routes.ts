import { Router } from "express";
import { AuthController } from "./controller";
import { AuthServices } from "./services";
import { EmailService } from "../email-service/email.service";
import { envsAdapter } from "../../config/envs.adapter";

export class AuthRoutes {
    static get routes(): Router {

        const router = Router();

        const emailService = new EmailService(
            envsAdapter.MAILER_SERVICE,
            envsAdapter.MAILER_EMAIL,
            envsAdapter.MAILER_SECRET_KEY,
            envsAdapter.SEND_EMAIL,
        );

        const authService = new AuthServices(emailService);
        const authController = new AuthController(authService);

        router.post('/register', authController.register);
        router.post('/login', authController.login);
        router.post('/confirm-account', authController.confirmAccount);
        router.post('/request-code', authController.requestConfirmationCode);
        router.post('/forgot-password', authController.forgotPassword);
        router.post('/validate-token', authController.validateToken);
        router.post('/edit-password/:token', authController.editPassword);

        return router;
    }

}