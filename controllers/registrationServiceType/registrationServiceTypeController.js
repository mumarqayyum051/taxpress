const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  createRegistrationServiceType,
  deleteRegistrationServiceType,
  getAllRegistrationServiceTypes,
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
router.get("/getAllRegistrationServiceTypes", getAllRegistrationServiceTypes);
module.exports = router;
