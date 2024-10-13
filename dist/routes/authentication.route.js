"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../database/models/User.model"));
const validations_1 = require("../validations");
const jwt_validation_1 = require("../validations/jwt.validation");
const router = (0, express_1.Router)();
// Signup Route
router.route('/signup').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ body: req.body });
    try {
        const body = yield validations_1.signupSchema.validate(req.body);
        // Hash the password before saving it to the database
        const hashedPassword = yield bcrypt_1.default.hash(body.password, 10);
        body.password = hashedPassword;
        const result = yield User_model_1.default.create(body);
        console.log({ result });
        res.send(result);
    }
    catch (error) {
        console.log("In catch block", error);
        res.status(400).send({ message: error.message });
    }
}));
// Login Route
router.route('/login').post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received login request with body:", req.body);
    try {
        // Validate request body using Yup
        const body = yield validations_1.loginSchema.validate(req.body);
        console.log("Validation successful:", body);
        // Check if user with provided email exists
        const user = yield User_model_1.default.findOne({ email: body.email.toLowerCase() });
        if (!user) {
            return res.status(400).send({ message: 'User with this email does not exist' });
        }
        // Compare the provided password with the stored password using bcrypt
        const isPasswordValid = yield bcrypt_1.default.compare(body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, jwt_validation_1.JWT_SECRET, { expiresIn: '1h' });
        console.log("Token is :", token);
        // Set token in a cookie
        // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 }); // 1 hour expiration
        res.send({ message: 'Login successful', token });
    }
    catch (error) {
        console.error("Error during login process:", error);
        res.status(400).send({ message: error.message });
    }
}));
exports.default = router;
