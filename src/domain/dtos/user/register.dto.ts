import { regularExps } from "../../../config/regular-express.adapter";

export class RegisterUserDto {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { email, password, name } = object;

        if (!name) return ['El nombre es requerido'];
        if (!email) return ['El correo es requerido'];
        if (!regularExps.email.test(email)) return ['Correo inválido'];

        if (password.length === 0) return ['La contraseña es requerida'];

        return [undefined, new RegisterUserDto(email, password, name)];
    }
}

