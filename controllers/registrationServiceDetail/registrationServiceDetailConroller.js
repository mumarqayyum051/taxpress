const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  createServiceDetail,
  deleteSerivce,
  getAllServices,
} = require("./registrationSerivceDetailService");

router.post("/createServiceDetail", cpUpload, createServiceDetail);
router.get("/getAllServices", getAllServices);
router.delete("/deleteService/:id", deleteSerivce);

module.exports = router;
