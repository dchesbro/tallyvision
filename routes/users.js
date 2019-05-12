var express = require('express');
var router  = express.Router();

// Get user index.
router.get('/', function(req, res, next) {
    res.render('users', { title: 'TALLYVISION', categories: res.app.get('categories'), contestants: res.app.get('contestants') });
});

module.exports = router;
