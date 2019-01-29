const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  jwt.verify(req.cookies.yoursso, 'json-secret', function (err, decoded) {
    if (err) {
      return next(err);
    } else {
      console.log(decoded);
      if (req.session) {
        res.clearCookie('yoursso');
        // delete session object
        req.session.destroy(function (err) {
          if (err) {
            return next(err);
          } else {
            return res.redirect('/login');
          }
        });
      }
    }
  });
});


module.exports = router;