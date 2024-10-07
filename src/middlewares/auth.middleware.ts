import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IRequest, IToken } from '../interfaces/generals';
import { JWT_SECRET } from '../validations/jwt.validation';

export const authenticate = (req: IRequest, res: Response, next: NextFunction) => {
    console.log('Auth middleware invoked');
    const token = req.cookies.token;
    // const token = req.headers.authorization?.split(' ')[1]; // req.headers.authorization?.split(' ')[1] extracts the token from the Authorization header of the request The header is expected to be in the format "Bearer <token>", so split(' ')[1] retrieves the actual token part.

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as IToken;
        console.log('Decoded JWT:', decoded);
        req.token = decoded; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).send({ message: 'Invalid token' });
    }
};




