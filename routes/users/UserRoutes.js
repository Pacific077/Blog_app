import express from "express";
import multer from "multer";
import storage from "../../config/cloudinary.js";
import {
  CoverPicUpload,
  LoginUser,
  LogoutUser,
  ProfilpicUpload,
  RegisterUser,
  UpdatePassword,
  UpdateProfile,
  UserDetails,
  UserProfile,
} from "../../controllers/users/UserController.js";
import Protected from "../../middlewares/protected.js"; 
const UserRoutes = express.Router();


//insatnce of multer
const upload = multer({storage});

//rendering forms

UserRoutes.get('/login',(req,res)=>{
  res.render('users/login.ejs',{
    error:""
  })
})
UserRoutes.get('/register',(req,res)=>{
  res.render('users/register.ejs',{
    error:""
  })
})

UserRoutes.get('/upload-profile-pic',(req,res)=>{
  res.render('users/uploadProfilePhoto.ejs',{
    error:""
  })
})
UserRoutes.get('/upload-cover-pic',(req,res)=>{
  res.render('users/uploadCoverPic.ejs',{
    error:""
  })
})
UserRoutes.get('/update-user',(req,res)=>{
  res.render('users/UpdateUser.ejs',{
    error:""
  })
})
UserRoutes.get('/update-pass',(req,res)=>{
  res.render('users/updatePassword.ejs',{
    error:""
  })
})

// reguster user
UserRoutes.post("/register", RegisterUser);

// login user
UserRoutes.post("/login", LoginUser);

// details user

UserRoutes.get("/details/:id", UserDetails);

// profile user
UserRoutes.get("/profile-page", Protected,UserProfile);

// profile pic upload
UserRoutes.put("/profile-photo-upload" , Protected ,upload.single('profile') ,ProfilpicUpload);

// cover pic upload
UserRoutes.put("/cover-photo-upload",Protected ,upload.single('profile') ,CoverPicUpload);

// update password
UserRoutes.put("/updatePassword", UpdatePassword);

// update user
UserRoutes.put("/update", UpdateProfile);

// logout user
UserRoutes.get("/logout", LogoutUser);

export default UserRoutes;
