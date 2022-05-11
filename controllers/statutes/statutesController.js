const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);
const { addStatutes, searchStatutes } = require("./statutesService");

router.post("/addStatutes", cpUpload, addStatutes);

router.post("/searchStatutes", searchStatutes);

module.exports = router;
