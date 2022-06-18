const express = require("express");

const router = express.Router();

var multer = require("../../utilities/multer");
var cpUpload = multer.any();

const { uploadBgs, getBgs, deleteBg } = require("./backgroundService");

router.post("/uploadBgs", cpUpload, uploadBgs);
router.get("/getBgs/:path", getBgs);
router.delete("/deleteBg/:path/:id", deleteBg);

module.exports = router;
