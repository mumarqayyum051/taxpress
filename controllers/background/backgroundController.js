const express = require("express");

const router = express.Router();

var multer = require("../../utilities/multer");
var cpUpload = multer.any();

const { uploadBgs, getBgs } = require("./backgroundService");

router.post("/uploadBgs", cpUpload, uploadBgs);
router.get("/getBgs/:path", getBgs);

module.exports = router;
