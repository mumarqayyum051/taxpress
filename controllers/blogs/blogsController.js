const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
} = require("./blogsService");

router.post("/createBlog", cpUpload, createBlog);

router.get("/getAllBlogs", getAllBlogs);

router.get("/getBlogById/:blogId", getBlogById);

router.delete("/deleteBlogById/:blogId", deleteBlogById);

module.exports = router;
