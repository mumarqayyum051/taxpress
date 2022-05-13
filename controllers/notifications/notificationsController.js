const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);
const {
  createNotification,
  searchNotifications,
} = require("./notificationsService");

router.post("/createNotification", cpUpload, createNotification);

router.post("/searchNotifications", searchNotifications);
module.exports = router;
