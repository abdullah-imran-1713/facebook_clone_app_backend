import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Post model
interface IPost extends Document {
  caption: string;
  image?: string| null;
  userId: Schema.Types.ObjectId;
}

// Create the Post schema
const PostSchema: Schema = new Schema(
  {
    caption: {
      type: String,
      required: true, // Caption is required
      trim: true,     // Trims whitespace around the caption
    },
    image: {
      type: String, 
      required: false, 
      trim: true,     
      allowNull: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Post model
const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;