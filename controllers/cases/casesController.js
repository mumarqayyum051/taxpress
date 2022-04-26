const express = require("express");

const router = express.Router();

const { uploadCase, searchCase } = require("./casesService");

router.post("/uploadCase", uploadCase);
router.post("/searchCase", searchCase);

module.exports = router;
