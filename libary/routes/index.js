const express = require('express');
const router = express.Router();

/*  Home route redirect to the direct to the books route */
router.get('/', (req, res, next) => {
  res.redirect("/books")
});

module.exports = router;
