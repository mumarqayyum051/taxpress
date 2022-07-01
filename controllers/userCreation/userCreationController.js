const express = require("express");
const auth = require("../auth");
const isToken = require("../auth");

const router = express.Router();

const { createUser, getUsers, deleteAdmin } = require("./userCreationService");

router.post("/", auth.required, auth.admin, createUser);
router.get("/", auth.required, auth.admin, getUsers);
router.delete("/:id", auth.required, auth.admin, deleteAdmin);

module.exports = router;
