"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //  Imports the necessary modules from Express. Express is the type of the app object, and Request and Response are types for handling HTTP requests and responses
const dotenv_1 = __importDefault(require("dotenv")); // Imports the dotenv package, which loads environment variables from a .env file into process.env.
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connection_1 = __importDefault(require("./database/connection"));
const authentication_route_1 = __importDefault(require("./routes/authentication.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const jwt_validation_1 = require("./validations/jwt.validation");
const cors_1 = __importDefault(require("cors"));
(0, jwt_validation_1.validateJwt)();
dotenv_1.default.config(); //  Loads environment variables from a .env file if it exists. This is useful for keeping sensitive data (like API keys or database URLs) out of your source code.
(0, connection_1.default)();
const app = (0, express_1.default)(); // Creates an instance of an Express application. The Express type is used to ensure type safety
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use(express_1.default.json());
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type']
// }));
app.use((0, cors_1.default)({
    origin: '*',
}));
// Middleware to parse cookies
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send({
        server: 'FB CLone',
        version: 'v1'
    });
});
app.use("/auth", authentication_route_1.default); // Mounts the AuthenticationRouter on the /auth path. All routes defined in AuthenticationRouter will be prefixed with /auth.
app.use('/posts', post_route_1.default); // Mounts the PostRouter on the /posts path. All routes defined in PostRouter will be prefixed with /posts.
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
