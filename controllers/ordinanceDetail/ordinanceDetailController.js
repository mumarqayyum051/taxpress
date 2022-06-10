const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  addOrdinanceDetail,
  getOrdinanceDetail,
  deleteOrdinanceDetail,
} = require("./ordinanceDetailService");

router.post("/addOrdinanceDetail", cpUpload, addOrdinanceDetail);
router.get("/getOrdinanceDetail", getOrdinanceDetail);
router.delete("/deleteOrdinanceDetail/:id", deleteOrdinanceDetail);
module.exports = router;
