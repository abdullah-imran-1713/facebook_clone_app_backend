"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const posts_controller_1 = __importDefault(require("../controllers/posts.controller"));
const multer_config_1 = __importDefault(require("../configs/multer.config"));
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.authenticate, multer_config_1.default.single("image"), posts_controller_1.default.createPost);
// Get all posts
router.get("/", auth_middleware_1.authenticate, posts_controller_1.default.getPost);
// Get a single post by ID
router.get("/:postId", auth_middleware_1.authenticate, posts_controller_1.default.getSinglePost);
// Update a post by ID
// Update a post by ID with inline token check
router.put("/:postId", auth_middleware_1.authenticate, posts_controller_1.default.updatePost);
// Delete a post by ID
router.delete("/:postId", auth_middleware_1.authenticate, posts_controller_1.default.deletePost);
exports.default = router;
