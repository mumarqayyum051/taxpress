const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  createRegistrationServiceType,
  deleteRegistrationServiceType,
} = require("./registrationServiceTypeService");

router.post(
  "/createRegistrationServiceType",
  cpUpload,
  createRegistrationServiceType,
);

router.delete(
  "/deleteRegistrationServiceType/:id",
  deleteRegistrationServiceType,
);
module.exports = router;
