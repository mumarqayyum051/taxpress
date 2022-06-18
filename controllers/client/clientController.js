const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");

const { addClient, getClients, deleteClient } = require("./clientService");

router.post("/addClient", cpUpload, addClient);
router.get("/getClients", getClients);
router.delete("/deleteClient/:id", deleteClient);

module.exports = router;
