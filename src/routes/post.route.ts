import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import postController from '../controllers/posts.controller';
import upload from "../configs/multer.config";

const router = Router();

router.post("/", authenticate, upload.single("image"), postController.createPost); 


// Get all posts
router.get("/", authenticate,postController.getPost);

// Get a single post by ID
router.get("/:postId",authenticate, postController.getSinglePost);

// Update a post by ID
// Update a post by ID with inline token check
router.put("/:postId",authenticate,postController.updatePost);


// Delete a post by ID
router.delete("/:postId", authenticate,postController.deletePost);

export default router;
