const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const {
  setAppointmentsTime,
  deleteAppointmentSchedule,
  getAppointmentSlots,
  createAppoinmentSlot,
  getAppointmentSlotsByType,
  deleteAppointmentSlot,
  deleteAllAppointmentSlots,
  bookeAppointmentSlot,
  getAllAppointments,
  changeAppointmentStatus,
} = require("./appointmentsService");

router.post("/setAppointmentsTime", cpUpload, setAppointmentsTime);

router.delete("/deleteAppointmentSchedule/:id", deleteAppointmentSchedule);

router.get("/getAppointmentSlots", getAppointmentSlots);

router.post("/createAppoinmentSlot", createAppoinmentSlot);

router.get(
  "/getAppointmentSlotsByType/:appointmentType",
  getAppointmentSlotsByType,
);

router.delete("/deleteAppointmentSlot/:id", deleteAppointmentSlot);

router.delete("/deleteAllAppointmentSlots", deleteAllAppointmentSlots);

router.post("/bookeAppointmentSlot", bookeAppointmentSlot);
router.get("/getAllAppointments", getAllAppointments);

router.put("/changeAppointmentStatus/:id", changeAppointmentStatus);
module.exports = router;
