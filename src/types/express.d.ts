import { Request } from 'express';

// Extend the Request interface
declare global {
    namespace Express {
        interface Request {
            token?: IToken; // Or define a more specific type for `user` if needed
            
        }
    }
}
