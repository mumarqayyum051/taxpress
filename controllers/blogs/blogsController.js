const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);

const { createBlog, getAllBlogs, getBlogById } = require("./blogsService");
const checkFileType = (req, res, next) => {
  var file = req.files[0];
  var fileType = file.mimetype;

  console.log(file, fileType);
  if (fileType == "image/jpeg" || fileType == "image/jpg") {
    next();
  } else {
    res.status(400).json({
      message: "File type not supported",
    });
  }
};
router.post("/createBlog", checkFileType, cpUpload, createBlog);

router.get("/getAllBlogs", getAllBlogs);

router.get("/getBlogById/:blogId", getBlogById);

module.exports = router;
