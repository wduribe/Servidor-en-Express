import { regularExps } from "../../../config/regular-express.adapter";

export class RequestCodeDto {

    constructor(public readonly email: string) { }

    static create(object: { [key: string]: any }): [string?, RequestCodeDto?] {
        const { email } = object;

        if (!email) return ['El email es requerido'];
        if (!regularExps.email.test(email)) return ['Email inválido'];

        return [undefined, new RequestCodeDto(email)];
    }

}