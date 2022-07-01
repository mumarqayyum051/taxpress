const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const auth = require("../auth");
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
  assignment,
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
router.get(
  "/getAllAppointments",
  auth.required,
  auth.admin,
  getAllAppointments,
);

router.put("/changeAppointmentStatus/:id", changeAppointmentStatus);
router.post("/assignment/:id", auth.required, auth.admin, assignment);
module.exports = router;
