import Post from "../../models/posts/Post.js";
import User from "../../models/users/User.js";
import appErr from "../../utils/appErr.js";

const CreatePost = async (req, res,next) => {
  const { title, description, category } = req.body;
  try {
    if(!title||!description||!category||!req.file){
      return next(appErr("all fields required"));
    }
    //find the user 
    const Userid=req.session.Userauth;
    const Userfound = await User.findById(Userid);
    const Postcreated = await Post.create({
      title,
      description,
      category,
      image:req.file.path,
      user:Userfound._id
    })
    //push the post in users posts array
    Userfound.posts.push(Postcreated._id);
    // resave
    await Userfound.save()
    res.json({
      status: "success",
      data: Postcreated,
    });
  } catch (er) {
    return next(appErr(er.message));
  }
};
const PostLists = async (req, res,next) => {
  try {
    const post = await Post.find().populate('comments');

    res.json({
      status: "success",
      data: post,
    });
  } catch (er) {
    return next(appErr(er.message));
  }
};

const PostDetails = async (req, res,next) => {
  try {
    const postid = req.params.id;
    const post =await Post.findById(postid).populate('comments')
    res.json({
      status: "success",
      data: post,
    });
  } catch (er) {
    return next(appErr(er.message));
  }
};

const PostDelete = async (req, res,next) => {
  try {
    const post =await Post.findById(req.params.id);
    if(post.user.toString()!==req.session.Userauth.toString()){
      return next(appErr("cant delete this post",403))
    }
    //remove from user post array
    await Post.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      user: "post deleted",
    });
  } catch (er) {
    return next(appErr("er.message"));
  }
};

const PostUpdate = async (req, res,next) => {
  const {title,description,category} = req.body;

  try {
    
    const post =await Post.findById(req.params.id);
    if(post.user.toString()!==req.session.Userauth.toString()){
      return next(appErr("cant update this post",403))
    }
    //update
    const PostUpdated = await Post.findByIdAndUpdate(req.params.id,{
      title,
      description,
      category,
      image:req.file.path
    })
    res.json({
      status: "success",
      data: PostUpdated,
    });
  } catch (er) {
    return next(appErr(er.message))
  }
};
export { CreatePost, PostLists, PostDetails, PostDelete, PostUpdate };
