import { Request } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { Schema } from "mongoose";

export interface IRequest extends Request {
    token?: IToken,
}

export interface IToken {
    id:Schema.Types.ObjectId
}