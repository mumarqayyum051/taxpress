const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);
const { add, search } = require("./dictionayService");

router.post("/add", cpUpload, add);
router.post("/search", search);
module.exports = router;
