var express = require('express');
var router = express.Router();

router.use('/api', require('./api'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/kirpejoms", function(req, res, next){
  res.render("kirpejoms")
});

module.exports = router;