const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  createService,
  deleteSerivce,
  getServices,
  getAllServices,
} = require("./registrationServicesService");

router.post("/createService", cpUpload, createService);
router.delete("/deleteService/:id", deleteSerivce);
router.get("/getServices/:superCategory", getServices);
router.get("/getAllServices", getAllServices);

module.exports = router;
