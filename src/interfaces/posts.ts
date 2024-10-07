import { Schema } from "mongoose";

export interface IPostGetParams {
    postId: string,
}

export interface IPost {
    caption: string;
    image?: string;
    // userId?: string;
    userId?: Schema.Types.ObjectId;
}