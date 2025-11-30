import { NextFunction, Request, Response } from "express";
import { jwtAdapter } from "../../config/jwt.adapter";
import { IUser, UserModel } from "../../database/models/user.model";
import { Types } from "mongoose";


declare global {
	namespace Express {
		interface Request {
			user: IUser
		}
	}
}

export class Validator {
	static async validateToken(req: Request, res: Response, next: NextFunction) {
		const authorization = req.header('Authorization');
		if (!authorization) return res.status(401).json({ error: 'El token es requerido' });
		if (!authorization.startsWith('Bearer')) return res.status(401).json({ error: 'Inválido token bearer' });
		const token = authorization.split(' ').at(1) || '';

		try {

			const payload = await jwtAdapter.validateToken<{ id: Types.ObjectId }>(token)
			if (!payload) return res.status(401).json({ error: 'Token inválido' });

			const user = await UserModel.findById(payload.id);
			if (!user) return res.status(401).json({ error: 'No encontramos un usuario con este token' });

			req.user = user;

			next();

		} catch (error) {
			res.status(500).json({ error: 'Error interno de servidor' });
		}

	}

	static async validateRole(req: Request, res: Response, next: NextFunction) {
		if (!req.user.role.includes('ADMIN_ROLE')) return res.status(401).json({ error: 'Esta acción solo puede ser ejecutada por un usuario administrador' })
		next();
	}
}