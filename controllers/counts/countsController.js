const express = require("express");

const router = express.Router();

const { getCounts } = require("./countsService");

router.get("/getCounts", getCounts);

module.exports = router;
