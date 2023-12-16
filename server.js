import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import methodOverride from "method-override"
import { dirname } from "path";
import { fileURLToPath } from "url";

import dbConnect from "./config/dbConnect.js";
import UserRoutes from "./routes/users/UserRoutes.js";
import PostRoutes from "./routes/posts/PostRoutes.js";
import CommentRoutes from "./routes/comments/CommentRoutes.js";
import GlobalErHandler from "./middlewares/globaErrhandler.js";

const app = express();

dotenv.config();
dbConnect();

//middlewares
const __dirname = dirname(fileURLToPath(import.meta.url));
//config ejs
app.set("view engine", "ejs");
//serve static files
console.log("dir", __dirname);
app.use(express.static(__dirname + "/public"));
app.use(express.json()); //pass incomig data in json
app.use(express.urlencoded({ extended: true })); //pass form data
//method override
app.use(methodOverride("_method"))
//session cofiguration
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60,
    }),
  })
);
//sving login credention to locals
app.use((req, res, next) => {
  if (req.session.Userauth) {
    res.locals.Userauth = req.session.Userauth;
  } else {
    res.locals.Userauth = null;
  }
  next();
});

//render home
app.get("/", (req, res) => {
  res.render("index.ejs");
});
//routes
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/posts", PostRoutes);
app.use("/api/v1/comment", CommentRoutes);

//error handling
app.use(GlobalErHandler);

const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(` server runnning on Port ${PORT}`));
