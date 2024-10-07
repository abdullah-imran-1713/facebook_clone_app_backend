import { Request,Response } from "express";
import { PostService } from "../services/posts.service";
import { IPost } from "../interfaces/posts";
import { IRequest } from "../interfaces/generals";
import Post from "../database/models/Post.model";
import { validatePostSchema } from "../validations/post.validation";
import { consoleLog } from "../utils/common";
import { uploadToCloud } from "../configs/cloudinary.config";

//Creating Post
const createPost = async (req: IRequest, res: Response) => {
    try {
        const { caption } = req.body;
        console.log('Request Body:', req.body);
        console.log('Request File:', req.file);

        // Validate the incoming request body
        await validatePostSchema.validate(req.body, { abortEarly: false });

        console.log('Token:', req.token);

        // Initialize imageUrl as undefined
        let imageUrl: string | undefined;
        consoleLog(req.file?.path);

        // Check if file exists and was uploaded via Multer
        if (req.file) {
            const response = await uploadToCloud(req);
            imageUrl = response?.secure_url;
        }

        // Create the post data object
        const postData: IPost = {
            caption,
            image: imageUrl,  // imageUrl can be undefined if no image is uploaded
            userId: req?.token?.id, // Ensure userId is correctly retrieved from token
        };

        // Create the post via the PostService
        const postService = new PostService();
        const result = await postService.createPost(postData);

        console.log('New post created with ID:', result._id);
        res.status(201).json(result); // Send the created post as response

    } catch (error: any) {
        console.error('Error creating post:', error);

        // Handle validation errors (if any)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.errors });
        }

        // Generic internal server error
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getPost = async (req: IRequest, res: Response) => {
    try {
        // Use req.token.id to get the current user's ID
        const userId = req?.token?.id;
        
        // Find posts where the userId matches // should be in services
        const posts = await Post.find({ userId: userId });
        
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

  
// Get post by id

const getSinglePost = async (req: IRequest, res: Response) => {
  try {
    // Use req.token.id to get the current user's ID
    const userId = req?.token?.id;

    // Find the post by its ID
    const post = await Post.findById(req.params.postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure userId is a string and post.userId is converted to string for comparison
    if (!post.userId || (post.userId as any).toString() !== userId) {
        console.log("post user id:",post.userId)
        console.log("current user id:",userId)
      return res.status(403).json({ message: "Unauthorized access to this post" });
    }

    // If the user is authorized, return the post
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Update post by id

const updatePost = async (req: IRequest, res: Response) => {
    try {
      // Use req.token.id to get the current user's ID
      const userId = req?.token?.id;

      const token = req.cookies.token;
      const { caption, image } = req.body;
  
      await validatePostSchema.validate(req.body, { abortEarly: false });

       // Find the post by its ID
    const post = await Post.findById(req.params.postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure userId is a string and post.userId is converted to string for comparison
    if (!post.userId || (post.userId as any).toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to this post" });
    }

  
      const postService = new PostService();
      const updatedPost = await postService.updatePost(req.params.postId,token,caption,image);
  
      res.json(updatedPost);
    } catch (error: any) {
      if (error.message === "Invalid token") {
        return res.status(403).json({ message: error.message });
      }
    //   if (error.message === "Post not found or you're not the owner") {
    //     return res.status(404).json({ message: error.message });
    //   }
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

const deletePost = async (req: IRequest, res: Response) => {

        try {

            // Use req.token.id to get the current user's ID
      const userId = req?.token?.id;

       // Find the post by its ID
    const post = await Post.findById(req.params.postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure userId is a string and post.userId is converted to string for comparison
    if (!post.userId || (post.userId as any).toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to this post" });
    }

            const deletedPost = await Post.findByIdAndDelete(req.params.postId);
            // if (!deletedPost) {
            //     return res.status(404).json({ message: "Post not found" });
            // }
            res.json({ message: "Post deleted successfully", deletedPost });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }

    }


export default {
    createPost, getPost, getSinglePost,updatePost,deletePost
}