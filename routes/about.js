const express = require('express');
const router = express.Router();

// Render About page
router.get('/about', (req, res) => {
  res.render('about'); // This will render the about.ejs file
});

module.exports = router;
