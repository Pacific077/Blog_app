import User from "../../models/users/User.js";
import bcrypt from "bcrypt";
import appErr from "../../utils/appErr.js";

const RegisterUser = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.render("users/register", {
      error: "All feilds required",
    });
  }
  try {
    const UserFound = await User.findOne({ email });
    if (UserFound) {
      return res.render("users/register", {
        error: "email already exist",
      });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    //register User

    const user = await User.create({
      fullname,
      email,
      password: hashedPass,
    });

    //redirect
    res.redirect("/api/v1/user/profile-page");
  } catch (Er) {
    res.json(Er);
  }
};

const LoginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("users/login", {
      error: "All feilds required",
    });
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.render("users/login", {
        error: "Invalid email",
      });
    }
    //verify pass

    const isPassMatch = await bcrypt.compare(password, userFound.password);
    if (!isPassMatch) {
      return res.render("users/login", {
        error: "Invalid pass",
      });
    }

    //save user to sessin
    req.session.Userauth = userFound._id;

    res.redirect("/api/v1/user/profile-page");
  } catch (Er) {
    res.json(Er);
  }
};

const UserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    res.json({
      status: "success",
      user: user,
    });
  } catch (Er) {
    res.json(Er);
  }
};

const UserProfile = async (req, res) => {
  try {
    const UserId = req.session.Userauth;
    const user = await User.findById(UserId)
      .populate("posts")
      .populate("comments");
   res.render('users/profile',{ user });
  } catch (Er) {
    res.json(Er);
  }
};

const ProfilpicUpload = async (req, res) => {
  try {
    if(!req.file){
      return res.render("users/uploadProfilePhoto",{
        error:"Please upload the Image"
      })
    }
    //find user to be updated
    const UserId = req.session.Userauth;
    const userFound = await User.findById(UserId);
    if (!userFound) {
      return res.render("users/uploadProfilePhoto",{
        error:"User not Found"
      })
    }
    //update pic
    const updateduser = await User.findByIdAndUpdate(UserId, {
      profileImage: req.file.path,
    });
    res.redirect("/api/v1/user/profile-page")
  } catch (Er) {
    return res.render("users/uploadProfilePhoto",{
      error:Er.message
    })
  }
};

const CoverPicUpload = async (req, res) => {
  try {
    if(!req.file){
      return res.render("users/uploadCoverPic.ejs",{
        error:"Please upload the Image"
      })
    }
    //find user to be updated
    const UserId = req.session.Userauth;
    const userFound = await User.findById(UserId);
    if (!userFound) {
      return res.render("users/uploadCoverPic.ejs",{
        error:"User not found"
      })
    }
    //update pic
    await User.findByIdAndUpdate(UserId, {
      coverImage: req.file.path,
    });
    res.redirect("/api/v1/user/profile-page")
  } catch (Er) {
    return res.render("users/uploadCoverPic",{
      error:Er.message
    })
  }
};

const UpdatePassword = async (req, res, next) => {
  const { password } = req.body;
  if(!password){
    return res.render('users/updatePassword',{
      error:"please enter the password"
    })
  }
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(req.session.Userauth, {
        password: hashedPass,
      });
      return res.redirect("/api/v1/user/profile-page")
    }
  } catch (Er) {
    return res.json(next(appErr(Er.message)));
  }
};

const UpdateProfile = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  if(!email||!fullname||!password){
    return res.render('users/Updateuser.ejs',{
      error:"All fields required"
    })
  }
  try {
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.render('users/Updateuser.ejs',{
          error:"Email already exists"
        })
      }
    }
     await User.findByIdAndUpdate(req.session.Userauth, {
      fullname,
      email
    });
    return res.redirect('/api/v1/user/profile-page')
  } catch (Er) {
    return res.render('users/Updateuser.ejs',{
      error:Er.message
    })
  }
};

const LogoutUser = async (req, res) => {
  //destroy the session
  req.session.destroy(() => {
    res.redirect("/api/v1/user/login");
  });
};

export {
  RegisterUser,
  LoginUser,
  UserDetails,
  UserProfile,
  ProfilpicUpload,
  CoverPicUpload,
  UpdatePassword,
  UpdateProfile,
  LogoutUser,
};
