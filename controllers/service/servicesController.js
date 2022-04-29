const express = require("express");

const router = express.Router();

const {
  createService,
  editServiceById,
  deleteServiceById,
  getServiceById,
  getAllServices,
  createServiceCategory,
  getServicesByServiceType,
} = require("./servicesService");

router.post("/createService", createService);
router.get("/getServiceById/:serviceID", getServiceById);
router.put("/editServiceById/:serviceID", editServiceById);
router.delete("/deleteServiceById/:serviceID", deleteServiceById);
router.get("/getAllServices", getAllServices);
router.post("/createServiceCategory", createServiceCategory);
router.get(
  "/getServicesByServiceType/:serviceTypeID",
  getServicesByServiceType,
);

module.exports = router;
