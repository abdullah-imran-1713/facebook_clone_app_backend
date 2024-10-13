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
const posts_service_1 = require("../services/posts.service");
const Post_model_1 = __importDefault(require("../database/models/Post.model"));
const post_validation_1 = require("../validations/post.validation");
const common_1 = require("../utils/common");
const cloudinary_config_1 = require("../configs/cloudinary.config");
//Creating Post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { caption } = req.body;
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file);
        // Validate the incoming request body
        yield post_validation_1.validatePostSchema.validate(req.body, { abortEarly: false });
        console.log('Token:', req.token);
        // Initialize imageUrl as undefined
        let imageUrl;
        (0, common_1.consoleLog)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
        // Check if file exists and was uploaded via Multer
        if (req.file) {
            const response = yield (0, cloudinary_config_1.uploadToCloud)(req);
            imageUrl = response === null || response === void 0 ? void 0 : response.secure_url;
        }
        // Create the post data object
        const postData = {
            caption,
            image: imageUrl, // imageUrl can be undefined if no image is uploaded
            userId: (_b = req === null || req === void 0 ? void 0 : req.token) === null || _b === void 0 ? void 0 : _b.id, // Ensure userId is correctly retrieved from token
        };
        // Create the post via the PostService
        const postService = new posts_service_1.PostService();
        const result = yield postService.createPost(postData);
        console.log('New post created with ID:', result._id);
        res.status(201).json(result); // Send the created post as response
    }
    catch (error) {
        console.error('Error creating post:', error);
        // Handle validation errors (if any)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.errors });
        }
        // Generic internal server error
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Use req.token.id to get the current user's ID
        const userId = (_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.id;
        // Find posts where the userId matches // should be in services
        const posts = yield Post_model_1.default.find({ userId: userId });
        res.json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Get post by id
const getSinglePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Use req.token.id to get the current user's ID
        const userId = (_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.id;
        // Find the post by its ID
        const post = yield Post_model_1.default.findById(req.params.postId);
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Ensure userId is a string and post.userId is converted to string for comparison
        if (!post.userId || post.userId.toString() !== userId) {
            console.log("post user id:", post.userId);
            console.log("current user id:", userId);
            return res.status(403).json({ message: "Unauthorized access to this post" });
        }
        // If the user is authorized, return the post
        res.json(post);
    }
    catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Update post by id
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Use req.token.id to get the current user's ID
        const userId = (_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.id;
        const token = req.cookies.token;
        const { caption, image } = req.body;
        yield post_validation_1.validatePostSchema.validate(req.body, { abortEarly: false });
        // Find the post by its ID
        const post = yield Post_model_1.default.findById(req.params.postId);
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Ensure userId is a string and post.userId is converted to string for comparison
        if (!post.userId || post.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized access to this post" });
        }
        const postService = new posts_service_1.PostService();
        const updatedPost = yield postService.updatePost(req.params.postId, token, caption, image);
        res.json(updatedPost);
    }
    catch (error) {
        if (error.message === "Invalid token") {
            return res.status(403).json({ message: error.message });
        }
        //   if (error.message === "Post not found or you're not the owner") {
        //     return res.status(404).json({ message: error.message });
        //   }
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Use req.token.id to get the current user's ID
        const userId = (_a = req === null || req === void 0 ? void 0 : req.token) === null || _a === void 0 ? void 0 : _a.id;
        // Find the post by its ID
        const post = yield Post_model_1.default.findById(req.params.postId);
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Ensure userId is a string and post.userId is converted to string for comparison
        if (!post.userId || post.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized access to this post" });
        }
        const deletedPost = yield Post_model_1.default.findByIdAndDelete(req.params.postId);
        // if (!deletedPost) {
        //     return res.status(404).json({ message: "Post not found" });
        // }
        res.json({ message: "Post deleted successfully", deletedPost });
    }
    catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = {
    createPost, getPost, getSinglePost, updatePost, deletePost
};
