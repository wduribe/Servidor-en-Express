import jwt from 'jsonwebtoken';
import { envsAdapter } from './envs.adapter';


const JSON_SECRET_KEY = envsAdapter.JSON_SECRET_KEY;

export const jwtAdapter = {

    generateToken: async <T>(payload: any, duration: '12h' = '12h'): Promise<T | null> => {
        return new Promise(resolve => {
            jwt.sign(payload, JSON_SECRET_KEY, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                resolve(token as T);
            });
        }) 
    },
    validateToken: async <T>(token: string): Promise<T | null> => {
        return new Promise(resolve => {
            jwt.verify(token, JSON_SECRET_KEY, (err, decoded) => {
                if (err) return resolve(null);
                resolve(decoded as T);
            })
        });
    }

}