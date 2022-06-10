const express = require("express");

const router = express.Router();
var multer = require("../../utilities/multer");
var cpUpload = multer.single("file");
const {
  addMember,
  editMember,
  deleteMember,
  getAllMembers,
  getMember,
} = require("./teamService");

router.post("/addMember", cpUpload, addMember);
router.delete("/deleteMember/:id", deleteMember);
router.put("/editMember/:id", cpUpload, editMember);
router.get("/getAllMembers", getAllMembers);
router.get("/getMember/:id", getMember);
module.exports = router;
