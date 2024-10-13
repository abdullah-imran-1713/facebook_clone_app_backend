"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_validation_1 = require("../validations/jwt.validation");
const authenticate = (req, res, next) => {
    console.log('Auth middleware invoked');
    const token = req.cookies.token;
    // const token = req.headers.authorization?.split(' ')[1]; // req.headers.authorization?.split(' ')[1] extracts the token from the Authorization header of the request The header is expected to be in the format "Bearer <token>", so split(' ')[1] retrieves the actual token part.
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_validation_1.JWT_SECRET);
        console.log('Decoded JWT:', decoded);
        req.token = decoded; // Attach user info to request
        next();
    }
    catch (error) {
        res.status(401).send({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
