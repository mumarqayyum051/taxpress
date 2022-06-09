const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const { add, search, getAllWords } = require("./dictionayService");

router.post("/add", cpUpload, add);
router.post("/search", search);
router.get("/getAll", getAllWords);
module.exports = router;
