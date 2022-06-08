const express = require("express");

const router = express.Router();

const {
  getOrdinances,
  deleteOrdinance,
  addOrdinance,
} = require("./ordinanceService");

router.post("/addOrdinance", addOrdinance);
router.get("/getOrdinances", getOrdinances);
router.delete("/deleteOrdinance/:id", deleteOrdinance);
module.exports = router;
