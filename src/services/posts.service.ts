import { IPost } from "../interfaces/posts";
import Post from "../database/models/Post.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../validations/jwt.validation";

export class PostService {

    async createPost(post: IPost) {

        const newPost = new Post({
            caption: post.caption,
            image: post.image || null,
            userId: post.userId,
            
        });

    const savedPost = await newPost.save();
    return savedPost;
  }

  async updatePost(postId: string, token: string, caption: string, image?: string) {
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);

      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, userId: (decodedToken as any).id },
        { caption, image },
      );

      if (!updatedPost) {
        throw new Error("Post not found or you're not the owner");
      }

      return updatedPost;
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error("Invalid token");
      }
      throw error;
    }
  }
}