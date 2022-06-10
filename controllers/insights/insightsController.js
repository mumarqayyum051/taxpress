const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const {
  addInsight,
  getAllInsights,
  getTopInsights,
} = require("./insightsService");

router.post("/addInsight", cpUpload, addInsight);
router.get("/getAllInsights", getAllInsights);
router.get("/getTopInsights", getTopInsights);
module.exports = router;
