const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  addStatutes,
  searchStatutes,
  getAllStatutes,
  getStatutesOnly,
  editStatutesById,
  getStatuteById,
  deleteStatute,
} = require("./statutesService");

router.post("/addStatutes", cpUpload, addStatutes);
router.put("/editStatute/:id", cpUpload, editStatutesById);
router.post("/searchStatutes", searchStatutes);
router.get("/getAllStatutes", getAllStatutes);
router.get("/getStatutesOnly", getStatutesOnly);
router.get("/getStatuteById/:id", getStatuteById);
router.delete("/deleteStatute/:id", deleteStatute);

module.exports = router;
