const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");

var cpUpload = multer.single("file");
const {
  createServiceDetail,
  deleteSerivce,
  getAllServices,
  getDetailByType,
  getDetailedServicesById,
  getAllServicesByType,
} = require("./registrationSerivceDetailService");

router.post("/createServiceDetail", cpUpload, createServiceDetail);
router.get("/getAllServices", getAllServices);
router.get("/getAllServicesByType/:superCategory", getAllServicesByType);
router.delete("/deleteService/:id", deleteSerivce);
router.get("/getDetailedServicesById/:id", getDetailedServicesById);
router.get("/getDetailByType/:superCategory/:typeId/:id", getDetailByType);

module.exports = router;
