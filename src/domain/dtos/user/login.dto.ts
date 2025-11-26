import { regularExps } from "../../../config/regular-express.adapter";



export class LoginDto {

    constructor(
        public readonly email: string,
        public readonly password: string
    ) { }

    static create(object: { [key: string]: any }): [string?, LoginDto?] {
        const { email, password } = object;

        if (!email) return ['El correo es obligatorio'];

        if (password.length === 0) return ['La contraseña es requerida'];
        if (password.length < 8) return ['Debe tener minimo 8 caracteres'];

        if (!regularExps.regularCapital.test(password)) return ['Debe tener al menos una letra mayúscula'];
        if (!regularExps.regularLowercase.test(password)) return ['Debe tener al menos una letra minúscula'];
        if (!regularExps.regularNumber.test(password)) return ['Debe tener al menos un número'];
        if (!regularExps.regularSymbol.test(password)) return ['Debe tener al menos un símbolo'];

        return [undefined, new LoginDto(email, password)];
    }
}