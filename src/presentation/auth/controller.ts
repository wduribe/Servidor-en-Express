import { Request, Response } from "express";
import { AuthServices } from "./services";
import { CustomError } from "../../domain/error/error";
import { RegisterUserDto } from "../../domain/dtos/user/register.dto";
import { LoginDto } from "../../domain/dtos/user/login.dto";



export class AuthController {

    constructor(
        private readonly authService: AuthServices,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }

    register = (req: Request, res: Response) => {

        const [error, registerUserDto] = RegisterUserDto.create(req.body)

        if (error) {
            res.status(400).json({ error });
            return;
        }

        this.authService.register(registerUserDto!)
            .then(response => res.json(response))
            .catch(error => this.handleError(error, res));

    }

    login = (req: Request, res: Response) => {
        if (!req.body) {
            res.status(401).json({ error: 'Debe proporcionar los datos en su petición' });
            return;
        }

        const [error, userLoginDto] = LoginDto.create(req.body);

        if (error) {
            res.status(401).json({ error });
            return;
        }

        this.authService.login(userLoginDto!)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

    confirmAccount = (req: Request, res: Response) => {
        const token = req.body;

        if (!token) {
            res.status(400).json({ error: 'Token es requerido' });
            return;
        }

        this.authService.confirmAccount(token.token)
            .then(resp => res.json(resp))
            .catch(error => this.handleError(error, res));

    }

    requestConfirmationCode = (req: Request, res: Response) => { }





}