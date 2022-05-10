const express = require("express");

const router = express.Router();

const {
  createNotification,
  searchNotifications,
} = require("./notificationsService");

router.post("/createNotification", createNotification);

router.post("/searchNotifications", searchNotifications);
module.exports = router;
