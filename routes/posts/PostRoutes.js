import express from "express";
import multer from "multer";
import storage from "../../config/cloudinary.js";
import Protected from "../../middlewares/protected.js"
import {
  CreatePost,
  PostDelete,
  PostDetails,
  PostLists,
  PostUpdate,
} from "../../controllers/posts/PostController.js";

const PostRoutes = express.Router();
//multer instance
const Upload = multer({storage})
PostRoutes.get("/newPost",(req,res)=>{
  res.render('posts/addPost.ejs',{
    error:""
  });
})
PostRoutes.get("/update/:id",(req,res)=>{
  const postId = req.params.id;
  res.render('posts/updatePost.ejs',{
    error:"",
    postId
  });
})

PostRoutes.post("",Protected ,Upload.single('file'),CreatePost);

//get all  post

PostRoutes.get("", PostLists);

//post details

PostRoutes.get("/:id", PostDetails);

//post delete

PostRoutes.delete("/:id",Protected ,PostDelete);

//post updated

PostRoutes.put("/:id",Protected, Upload.single('file'),PostUpdate);

export default PostRoutes;
