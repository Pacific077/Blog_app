import express from "express";
import Protected from "../../middlewares/protected.js"
import {
  CommentDetails,
  CreateComment,
  DeleteComment,
  UpdateComment,
} from "../../controllers/comments/CommentController.js";
const CommentRoutes = express.Router();

CommentRoutes.post("/:id",Protected, CreateComment);

//comment details

CommentRoutes.get("/:id", CommentDetails);

//comment delete

CommentRoutes.delete("/:id",Protected, DeleteComment);

//comment updated

CommentRoutes.put("/:id",Protected, UpdateComment);

export default CommentRoutes;
