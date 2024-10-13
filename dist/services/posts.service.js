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
exports.PostService = void 0;
const Post_model_1 = __importDefault(require("../database/models/Post.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_validation_1 = require("../validations/jwt.validation");
class PostService {
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = new Post_model_1.default({
                caption: post.caption,
                image: post.image || null,
                userId: post.userId,
            });
            const savedPost = yield newPost.save();
            return savedPost;
        });
    }
    updatePost(postId, token, caption, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.verify(token, jwt_validation_1.JWT_SECRET);
                const updatedPost = yield Post_model_1.default.findOneAndUpdate({ _id: postId, userId: decodedToken.id }, { caption, image });
                if (!updatedPost) {
                    throw new Error("Post not found or you're not the owner");
                }
                return updatedPost;
            }
            catch (error) {
                if (error.name === 'JsonWebTokenError') {
                    throw new Error("Invalid token");
                }
                throw error;
            }
        });
    }
}
exports.PostService = PostService;
