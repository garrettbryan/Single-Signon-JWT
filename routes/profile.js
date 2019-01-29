var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');


/* GET home page. */
// GET route after registering
router.get('/', function (req, res, next) {
  res.render('profile', res );
});

router.post('/update', function (req, res, next) {
  User.findByIdAndUpdate(res.user.id, req.body, function (err, user) {
      res.redirect('/profile');
  });
});

module.exports = router;