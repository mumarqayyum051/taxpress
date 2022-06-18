const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const {
  createHeroSection,
  deleteheroSection,
  getHeroSection,
} = require("./heroSectionService");

router.post("/createHeroSection", createHeroSection);
router.delete("/deleteheroSection/:id", deleteheroSection);
router.get("/getHeroSection", getHeroSection);
module.exports = router;
