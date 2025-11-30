import { regularExps } from "../../../config/regular-express.adapter";



export class LoginDto {

    constructor(
        public readonly email: string,
        public readonly password: string
    ) { }

    static create(object: { [key: string]: any }): [string?, LoginDto?] {
        const { email, password } = object;

        if (!email) return ['El correo es requerido'];
        if (password.length === 0) return ['La contraseña es requerida'];
        
        if (!regularExps.email.test(email)) return ['Credenciales inválidas'];



        return [undefined, new LoginDto(email, password)];
    }
}