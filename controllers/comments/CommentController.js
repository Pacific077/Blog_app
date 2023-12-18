import Post from "../../models/posts/Post.js";
import User from "../../models/users/User.js";
import Comment from "../../models/comments/Comment.js";
import appErr from "../../utils/appErr.js";

const CreateComment = async (req, res, next) => {
  const { message } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if(!message){
      return res.render('posts/postDetails.ejs',{
        errorcmnt:"Comment cant be empty",post
      })
    }
    //find the post
    // create the comment
    const comment = await Comment.create({
      user: req.session.Userauth,
      message,
    });
    //push the comment to post
    post.comments.push(comment._id);

    //find the user
    const user = await User.findById(req.session.Userauth);
    user.comments.push(comment._id);

    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    return res.redirect("/api/v1/user/profile-page")
  } catch (er) {
    return next(appErr(er.message));
  }
};

const CommentDetails = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "comment details",
    });
  } catch (er) {
    res.json(er);
  }
};

const DeleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.user.toString() !== req.session.Userauth.toString()) {
      return next(appErr("not allowed to del this comment", 403));
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      user: "comment deleted",
    });
  } catch (er) {
    return next(appErr(er.message));
  }
};
const UpdateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.user.toString() !== req.session.Userauth.toString()) {
      return next(appErr("cant update this commnet", 403));
    }
    //update
    const commentUpdates = await Comment.findByIdAndUpdate(req.params.id, {
      message: req.body.message,
    });
    res.json({
      status: "success",
      data: commentUpdates,
    });
  } catch (er) {
    return next(appErr(er.message));
  }
};
export { CreateComment, CommentDetails, DeleteComment, UpdateComment };
