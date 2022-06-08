const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);
const { add, search, getAllWords } = require("./dictionayService");

router.post("/add", add);
router.post("/search", search);
router.get("/getAll", getAllWords);
module.exports = router;
