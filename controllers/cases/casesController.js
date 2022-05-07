const express = require("express");

const router = express.Router();

const { uploadCase, searchCase } = require("./casesService");
var multer = require("../../utilities/multer");

var cpUpload = multer.array("file", 1);

router.post("/addCase", cpUpload, uploadCase);
router.post("/searchCase", searchCase);

module.exports = router;
