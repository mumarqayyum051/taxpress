const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.array("file", 1);
const {
  addMember,
  editMember,
  deleteMember,
  getAllMembers,
  getMember,
} = require("./teamService");

router.post("/addMember", addMember);
router.delete("/deleteMember/:id", deleteMember);
router.put("/editMember/:id", editMember);
router.get("/getAllMembers", getAllMembers);
router.get("/getMember/:id", getMember);
module.exports = router;
