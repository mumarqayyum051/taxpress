const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  createService,
  deleteSerivce,
} = require("./registrationServicesService");

router.post("/createService", cpUpload, createService);
router.delete("/deleteService/:id", deleteSerivce);

module.exports = router;
