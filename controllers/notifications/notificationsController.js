const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const {
  createNotification,
  searchNotifications,
  getNotificationTypes,
  createNotificationType,
  getAllNotifications,
  deleteNotificationTypeById,
  deleteNotification,
} = require("./notificationsService");

router.post("/createNotification", cpUpload, createNotification);

router.post("/searchNotifications", searchNotifications);
router.post("/createNotificationType", createNotificationType);
router.get("/getNotificationTypes", getNotificationTypes);
router.get("/getAllNotifications", getAllNotifications);
router.delete("/deleteNotificationType/:id", deleteNotificationTypeById);
router.delete("/deleteNotification/:id", deleteNotification);
module.exports = router;
