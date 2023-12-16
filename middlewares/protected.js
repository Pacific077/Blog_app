import appErr from "../utils/appErr.js"

const Protected =  (req,res,next)=>{
    if(req.session.Userauth){
        next()
    }else{
        res.render('users/notAuthorize.ejs');
    }
}
export default Protected;