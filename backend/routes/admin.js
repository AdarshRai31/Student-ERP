const express = require('express');
const { authMiddlware } = require('../middlewares');
const { getAllSheets, SHEET_NAMES } = require('../goggle_apis/sheets');

const router = express.Router();

// List available Google Sheet tabs and configured sheet names
router.get('/sheets', authMiddlware, async (req, res) => {
  try {
    const tabs = await getAllSheets();
    res.json({
      success: true,
      tabs,
      configured: SHEET_NAMES
    });
  } catch (error) {
    console.error('Error listing sheets:', error);
    res.status(500).json({ success: false, message: 'Error listing sheets', error: error.message });
  }
});

module.exports = router;
