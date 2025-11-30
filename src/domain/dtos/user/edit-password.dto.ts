import { regularExps } from "../../../config/regular-express.adapter";




export class EditPasswordDto {
    constructor(
        public readonly token: string,
        public readonly newPassword: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, EditPasswordDto?] {
        const { token, newPassword } = object;
        if (!token) return ['El token es requerido'];

        if (newPassword.length === 0) return ['La contraseña es requerida'];
        if (newPassword.length < 8) return ['Debe tener minimo 8 caracteres'];

        if (!regularExps.regularCapital.test(newPassword)) return ['Debe tener al menos una letra mayúscula'];
        if (!regularExps.regularLowercase.test(newPassword)) return ['Debe tener al menos una letra minúscula'];
        if (!regularExps.regularNumber.test(newPassword)) return ['Debe tener al menos un número'];
        if (!regularExps.regularSymbol.test(newPassword)) return ['Debe tener al menos un símbolo'];

        return [undefined, new EditPasswordDto(token, newPassword)];
    }
}