import 'dotenv/config';
import { get } from 'env-var';



export const envsAdapter = {
    PORT: get('PORT').required().asPortNumber(),
    FRONTED_URL: get('FRONTED_URL').required().asString(),

    MONGO_PASSWORD: get('MONGO_PASSWORD').required().asString(),
    MONGO_NAME: get('MONGO_NAME').required().asString(),
    MONGO_URL: get('MONGO_URL').required().asString(),

    SEND_EMAIL: get('SEND_EMAIL').required().asBool(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),

    JSON_SECRET_KEY: get('JSON_SECRET_KEY').required().asString(),
}
