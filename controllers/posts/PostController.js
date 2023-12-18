import Post from "../../models/posts/Post.js";
import User from "../../models/users/User.js";
import appErr from "../../utils/appErr.js";

const CreatePost = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/addPost.ejs", {
        error: "All feilds necessary",
      });
    }

    //find the user
    const Userid = req.session.Userauth;
    const Userfound = await User.findById(Userid);
    const Postcreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: Userfound._id,
    });
    //push the post in users posts array
    Userfound.posts.push(Postcreated._id);
    // resave
    await Userfound.save();
    return res.redirect("/");
  } catch (er) {
    return next(appErr(er.message));
  }
};
const PostLists = async (req, res, next) => {
  try {
    const post = await Post.find().populate("comments");

    res.json({
      status: "success",
      data: post,
    });
  } catch (er) {
    return next(appErr(er.message));
  }
};

const PostDetails = async (req, res, next) => {
  try {
    const postid = req.params.id;
    const post = await Post.findById(postid)
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          model: "User",
        },
      });
    console.log(post);
    return res.render("posts/postDetails.ejs", {
      error: "",
      post,
    });
  } catch (er) {
    return next(appErr(er.message));
  }
};

const PostDelete = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.Userauth.toString()) {
      return res.render("users/notAuhtorize.ejs");
    }
    //remove from user post array
    await Post.findByIdAndDelete(req.params.id);
    return res.redirect("/api/v1/user/profile-page");
  } catch (er) {
    return next(appErr("er.message"));
  }
};

const PostUpdate = async (req, res, next) => {
  const { title, description, category } = req.body;

  try {
    if (!title || !description || !category || !req.file) {
      return res.render("posts/updatePost.ejs", {
        error: "All feilds necessary",
      });
    }
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.Userauth.toString()) {
      return res.render("user/notAuthorize.ejs");
    }
    //update
    await Post.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category,
      image: req.file.path,
    });
    res.redirect("/api/v1/user/profile-page");
  } catch (er) {
    return next(appErr(er.message));
  }
};
export { CreatePost, PostLists, PostDetails, PostDelete, PostUpdate };
