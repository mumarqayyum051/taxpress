const express = require('express');

const router = express.Router();

const {
  addCase,
  updateCase,
  searchCase,
  deleteCase,
  getAllCases,
  getCaseById,
} = require('./casesService');
var multer = require('../../utilities/multer');

var cpUpload = multer.single('file');

router.post('/addCase', cpUpload, addCase);
router.put('/updateCase/:id', updateCase);
router.post('/searchCase', searchCase);
router.delete('/deleteCase/:id', deleteCase);
router.get('/getAllCases', getAllCases);
router.get('/getCaseById/:id', getCaseById);

module.exports = router;
