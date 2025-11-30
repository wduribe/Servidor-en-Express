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
        if (!email) return ['El correo es obligatorio'];

        if (password.length === 0) return ['La contraseña es requerida'];
        if (password.length < 8) return ['Debe tener minimo 8 caracteres'];

        if (!regularExps.regularCapital.test(password)) return ['Debe tener al menos una letra mayúscula'];
        if (!regularExps.regularLowercase.test(password)) return ['Debe tener al menos una letra minúscula'];
        if (!regularExps.regularNumber.test(password)) return ['Debe tener al menos un número'];
        if (!regularExps.regularSymbol.test(password)) return ['Debe tener al menos un símbolo'];

        return [undefined, new RegisterUserDto(email, password, name)];
    }
}

