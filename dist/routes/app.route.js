"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_route_1 = __importDefault(require("./authentication.route"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Public route for login and signup
router.use('/auth', authentication_route_1.default);
// Protected route
router.get('/protected', auth_middleware_1.authenticate, (req, res) => {
    res.send({ message: 'This is a protected route' });
});
exports.default = router;
