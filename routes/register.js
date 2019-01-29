const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/', (req, res, next) => {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords don\'t match.');
    err.status = 400;
    return next(err);
  }
  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      admin: false
    };

    User.find({}, function (err, users) {
      if (err) {
        return next(err);
      }

      console.log(users.length);

      if (users.length === 0) {
        userData.admin = true;
      }

      User.create(userData, (error, user) => {
        if (error) {
          return next(error);
        } else {
          var cookie = req.cookies.cookieName;
          if (cookie === undefined) {
            var secret = 'json-secret';
            var payload = {
              'id': user._id,
              'username': user.username,
              'email': user.email,
              'groups': user.groups || []
            };
            // no: set a new cookie
            var options = {
              maxAge: 1000 * 60 * 15, // would expire after 15 minutes
              httpOnly: true, // The cookie only accessible by the web server
              // signed: true, // Indicates if the cookie should be signed
              //domain: '.garrettbryan.cloud'
              //name: 'yoursso.app'
            };

            jwt.sign(payload, secret, function (err, token) {
              if (err) {
                console.log(err);
              }
              res.cookie('yoursso', token, options);
              //console.log(req.cookies);
              console.log('register cookie created successfully');
              if (req.cookies.yourssoAppNextUrl) {
                return res.redirect('/profile');
              } else {
                return res.redirect('/profile');
              }
            });
          }
        }
      });
    });

  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
