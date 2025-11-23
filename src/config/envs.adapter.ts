import 'dotenv/config';
import { get } from 'env-var';



export const envsAdapter = {
    PORT: get('PORT').required().asPortNumber(),
    FRONTED_URL: get('FRONTED_URL').required().asString(),
    MONGO_PASSWORD: get('MONGO_PASSWORD').required().asString(),
    MONGO_NAME: get('MONGO_NAME').required().asString(),
    MONGO_URL: get('MONGO_URL').required().asString(),
}
