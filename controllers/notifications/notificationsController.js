const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);
const {
  createNotification,
  searchNotifications,
  getNotificationTypes,
  createNotificationType,
  getAllNotifications,
  deleteNotificationTypeById,
} = require("./notificationsService");

router.post("/createNotification", createNotification);

router.post("/searchNotifications", searchNotifications);
router.post("/createNotificationType", createNotificationType);
router.get("/getNotificationTypes", getNotificationTypes);
router.get("/getAllNotifications", getAllNotifications);
router.delete("/deleteNotificationType/:id", deleteNotificationTypeById);
module.exports = router;
