const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  createRegistrationServiceType,
  deleteRegistrationServiceType,
  getAllRegistrationServiceTypes,
  getTypesByServiceId,
  getTypesByServiceType,
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

router.get("/getTypesByServiceId/:id", getTypesByServiceId);
router.get("/getAllRegistrationServiceTypes", getAllRegistrationServiceTypes);
router.get("/getTypesByServiceType/:type", getTypesByServiceType);
module.exports = router;
