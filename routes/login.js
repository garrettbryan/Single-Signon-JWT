const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  // confirm that user typed same password twice
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, (err, user) => {
      console.log(user);
      if (err) {
        return  next(err)
      } else if (!user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        console.log(user);
        req.session.userId = user._id;

        const cookie = req.cookies.cookieName;
        if (cookie === undefined) {
          const secret = 'json-secret';
          const payload = {
            'id': user._id,
            'username': user.username,
            'email': user.email,
            'groups': user.groups || []
          };
          // no: set a new cookie
          const options = {
            maxAge: 1000 * 60 * 15, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server
            // signed: true,/ Indicates if the cookie should be signed
            //domain: '.garrettbryan.cloud /'
            //name: 'yoursso.app'
          };

          jwt.sign(payload, secret, (err, token) => {
            if (err) {
              console.log(err);
            }
            res.cookie('yoursso', token, options);
            console.log(res);
            console.log('register cookie created successfully');
            if (req.cookies.yourssoAppNextUrl) {
              return res.redirect('/affiliates');
            } else {
              return res.redirect('/affiliates');
            }
          });

        } else {
          // yes, cookie was already present 
          console.log('cookie exists', cookie);
        }
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});

module.exports = router;