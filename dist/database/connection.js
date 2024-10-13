"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDatabase() {
    mongoose_1.default.connect(process.env.DATABASE_CONNECTION_STRING || '')
        .then(() => console.log("MongoDB connected sucessfully!"))
        .catch((error) => console.log(error.message));
}
