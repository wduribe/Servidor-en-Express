import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { generateToken } from "../../config/generate-token.adapter";
import { jwtAdapter } from "../../config/jwt.adapter";
import { TokenModel } from "../../database/models/token.model";
import { UserModel } from "../../database/models/user.model";
import { EditPasswordDto } from "../../domain/dtos/user/edit-password.dto";
import { LoginDto } from "../../domain/dtos/user/login.dto";
import { RegisterUserDto } from "../../domain/dtos/user/register.dto";
import { RequestCodeDto } from "../../domain/dtos/user/request-code.dto";
import { CustomError } from "../../domain/error/error";
import { EmailService } from "../email-service/email.service";



export class AuthServices {

    constructor(
        private readonly emailService: EmailService,
    ) { }

    async register(registerUserDto: RegisterUserDto) {
        try {
            const existUser = await UserModel.findOne({ email: registerUserDto.email });
            if (existUser) throw CustomError.badRequest('Correo ya esta registrado en una cuenta');

            const newUser = new UserModel(registerUserDto);

            newUser.password = bcryptAdapter.hash(registerUserDto.password);

            //Generacion de token de confirmacion
            const token = new TokenModel();
            token.token = generateToken();
            token.user = newUser.id;

            //Enviando email
            this.sendTokenConfirmAccount(newUser.email, token.token);

            await Promise.allSettled([token.save(), newUser.save()]);

            return 'Usuario, registrado correctamente. Revisa tu correo para validar tu cuenta';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async login(loginDto: LoginDto) {

        try {
            const user = await UserModel.findOne({ email: loginDto.email });
            if (!user) throw CustomError.badRequest('Credenciales inválidas');

            const isMatch = bcryptAdapter.compare(loginDto.password, user.password)
            if (!isMatch) throw CustomError.badRequest('Credenciales inválidas');

            if (!user.confirmed) throw CustomError.unauthorized('Usuario debe confirmar su cuenta');

            const token = await jwtAdapter.generateToken<string>({ id: user.id });
            if (!token) CustomError.internalServer('Error mientras se creaba el Token de acceso');

            return {
                user,
                token,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    async confirmAccount(tokenConfirm: string) {

        try {
            const tokenExists = await TokenModel.findOne({ token: tokenConfirm });

            if (!tokenExists) throw CustomError.badRequest('Token inválido');

            const user = await UserModel.findById(tokenExists.user);
            if (!user) throw CustomError.badRequest('Usuario no existe');

            user.confirmed = true;

            const token = await jwtAdapter.generateToken<string>({ id: user.id });
            if (!token) CustomError.internalServer('Error mientras se creaba el Token de acceso');

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            return {
                user,
                token,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    async requestConfirmationCode(requestCodeDto: RequestCodeDto) {
        try {
            const user = await UserModel.findOne({ email: requestCodeDto.email });

            if (!user) throw CustomError.badRequest('El usuario no esta registrado');
            if (user.confirmed) throw CustomError.badRequest('Usuario ya está confirmado');

            //Generacion de token de confirmacion
            const token = new TokenModel();
            token.token = generateToken();
            token.user = user.id;

            //Enviando email
            this.sendTokenConfirmAccount(user.email, token.token);

            await Promise.allSettled([user.save(), token.save()]);

            return 'Se envió un nuevo token a tu email';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async forgotPassword(requestCodeDto: RequestCodeDto) {

        const user = await UserModel.findOne({ email: requestCodeDto.email });
        if (!user) throw CustomError.badRequest('El usuario no esta registrado');

        const token = new TokenModel();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        await this.sendTokenResetPassword(user.email, token.token);

        return 'Revisa tu email para reestablecer contraseña';

    }

    async validateToken(token: string) {
        try {
            const tokenExists = await TokenModel.findOne({ token });
            if (!tokenExists) throw CustomError.badRequest('Token inválido');

            return 'Token válido, define tu nueva contraseña';

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async editPassword(editPasswordDto: EditPasswordDto){

        try {
            const token = await TokenModel.findOne({ token: editPasswordDto.token });
            if (!token) throw CustomError.badRequest('Token inválido');

            const user = await UserModel.findById(token.user);
            if (!user) throw CustomError.badRequest('Usuario no encontrado');

            const passwordHashed = bcryptAdapter.hash(editPasswordDto.newPassword);
            user.password = passwordHashed;

            await Promise.allSettled([user.save(), token.deleteOne()]);

            return 'La contraseña se modificó correctamente';
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    private async sendTokenConfirmAccount(email: string, token: string) {

        const html = `
            <h1>LOGO AMARGA</h1>
			<h2>Valida tu correo</h2> 
			<p>Ingresa el siguiente codigo en la página del enlace de abajo para validar su cuenta.</p>
			<p><strong>Codigo:</strong> ${token}</p>
            <a>Enlace para ingresar el codigo</a>    
            `;

        const options = {
            to: email,
            subject: 'Validación de cuenta',
            htmlBody: html,
        };

        try {
            const isSend = await this.emailService.sendEmail(options);
            if (!isSend) throw CustomError.internalServer('Error mientras se enviaba correo de validación');

            return true;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    private async sendTokenResetPassword(email: string, token: string) {
        const html = `
			<h1>LOGO AMARGA</h1> 
            <h2>Recuperar contraseña</h2>
			<p>Has solicitado cambiar tu contraseña, visita el siguiente enlace e ingresa el codigo.</p>
			<p><strong>Codigo:</strong> ${token}</p>
            <a>Enlace para ingresar el codigo</a>    
            `;

        const options = {
            to: email,
            subject: 'Recuperación de contraseña',
            htmlBody: html,
        };

        try {
            const isSend = await this.emailService.sendEmail(options);
            if (!isSend) throw CustomError.internalServer('Error mientras se enviaba correo');

            return true;

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

}