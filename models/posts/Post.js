
import mongoose, { mongo } from "mongoose";
 
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["abc","def","ghi","jkl","mno"],
    },
    image: {
      type: String,
      required: true,
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]

  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post",PostSchema);

export default Post;