const express = require("express");

const router = express.Router();

const {
  addOrdinance,
  deleteOrdinance,
  getAllOrdinanceByType,
  getAllOrdinance,
} = require("./ordinanceService");

router.post("/addOrdinance", addOrdinance);
router.delete("/deleteOrdinance/:id", deleteOrdinance);
router.get("/getAllOrdinanceByType/:type", getAllOrdinanceByType);
router.get("/getAllOrdinance", getAllOrdinance);
module.exports = router;
