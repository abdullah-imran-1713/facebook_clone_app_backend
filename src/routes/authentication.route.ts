import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../database/models/User.model";
import { loginSchema, signupSchema } from "../validations";
import { JWT_SECRET } from "../validations/jwt.validation";

const router = Router();



// Signup Route
router.route('/signup').post(async (req: Request, res: Response) => {
    console.log({ body: req.body });

    try {
        const body = await signupSchema.validate(req.body);

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;

        const result = await User.create(body);
        console.log({ result });
        res.send(result);
    } catch (error: any) {
        console.log("In catch block", error);
        res.status(400).send({ message: error.message });
    }
});

// Login Route
router.route('/login').post(async (req: Request, res: Response) => {
    console.log("Received login request with body:", req.body);

    try {
        // Validate request body using Yup
        const body = await loginSchema.validate(req.body);
        console.log("Validation successful:", body);

        // Check if user with provided email exists
        const user = await User.findOne({ email: body.email.toLowerCase() });

        if (!user) {
            return res.status(400).send({ message: 'User with this email does not exist' });
        }

        // Compare the provided password with the stored password using bcrypt
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        console.log("Token is :",token);

       // Set token in a cookie
    // res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 
       res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 }); // 1 hour expiration

       res.send({ message: 'Login successful', token });
       
    } catch (error: any) {
        console.error("Error during login process:", error);
        res.status(400).send({ message: error.message });
    }
});

export default router;
