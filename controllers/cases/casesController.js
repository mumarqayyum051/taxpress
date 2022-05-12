const express = require("express");

const router = express.Router();

const { addCase, updateCase, searchCase } = require("./casesService");
var multer = require("../../utilities/multer");

var cpUpload = multer.array("file", 1);

router.post("/addCase", cpUpload, addCase);
router.put("/updateCase/:id", cpUpload, updateCase);
router.post("/searchCase", searchCase);

module.exports = router;
