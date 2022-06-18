const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const {
  changeAboutUs,
  deleteAboutUs,
  getAboutUs,
} = require("./aboutUsService");

router.post("/changeAboutUs", cpUpload, changeAboutUs);
router.delete("/deleteAboutUs/:id", deleteAboutUs);

router.get("/getAboutUs", getAboutUs);
module.exports = router;
