import express, { Express, Request, Response } from "express"; //  Imports the necessary modules from Express. Express is the type of the app object, and Request and Response are types for handling HTTP requests and responses
import dotenv from "dotenv"; // Imports the dotenv package, which loads environment variables from a .env file into process.env.
import cookieParser from 'cookie-parser';
import connectDatabase from './database/connection';
import AuthenticationRouter from './routes/authentication.route';
import PostRouter from './routes/post.route';
import {validateJwt} from "./validations/jwt.validation";
import cors from 'cors';


validateJwt();
dotenv.config(); //  Loads environment variables from a .env file if it exists. This is useful for keeping sensitive data (like API keys or database URLs) out of your source code.
connectDatabase();


const app: Express = express(); // Creates an instance of an Express application. The Express type is used to ensure type safety
const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


// Middleware to parse cookies
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
  res.send({
    server: 'FB CLone',
    version: 'v1'
  });
});

app.use("/auth", AuthenticationRouter); // Mounts the AuthenticationRouter on the /auth path. All routes defined in AuthenticationRouter will be prefixed with /auth.
app.use('/posts', PostRouter); // Mounts the PostRouter on the /posts path. All routes defined in PostRouter will be prefixed with /posts.

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

