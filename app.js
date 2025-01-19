require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const aboutRoute = require('./routes/about'); 
const cookieParser= require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog=require('./models/blog');
const session = require('express-session');

const app = express();
const PORT = process.env.port || 8000;

// Connect to MongoDB
//"mongodb://localhost:27017/blogify"
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up middleware
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public")));


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use(session({
  secret: 'SuperMan@123', // Replace with your secret key
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.get("/", async (req, res) => {
  const allBlogs=await Blog.find({});
  const successMessage = req.session.success;

    delete req.session.success;
  res.render("home",{
    user:req.user,
    blogs:allBlogs,
    success: successMessage,
  });
});


app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use(aboutRoute);

// Start server
app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
