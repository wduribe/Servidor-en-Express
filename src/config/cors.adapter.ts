import { CorsOptions } from 'cors';
import { envsAdapter } from './envs.adapter';

const FRONTED_URL = envsAdapter.FRONTED_URL;

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {

        let whiteList: [string | undefined] = [FRONTED_URL];

        if (process.argv[2] === '--api') {
            whiteList.push(origin);
        }

        if (whiteList.includes(origin!)) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
}