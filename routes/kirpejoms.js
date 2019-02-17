var express = require('express');
var router = express.Router();

/* GET kirpejoms page. */
router.get('/', function(req, res, next) {
  res.render('kirpejoms', { title: 'Express' });
});

module.exports = router;
