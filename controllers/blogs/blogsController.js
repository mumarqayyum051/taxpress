const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  editBlogById,
} = require("./blogsService");

router.post("/createBlog", cpUpload, createBlog);

router.get("/getAllBlogs", getAllBlogs);

router.get("/getBlogById/:blogId", getBlogById);

router.put("/editBlogById/:blogId", cpUpload, editBlogById);

router.delete("/deleteBlogById/:blogId", deleteBlogById);

module.exports = router;
