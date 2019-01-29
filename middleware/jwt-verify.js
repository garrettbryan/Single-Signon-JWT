var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

function jwtVerify(req, res, next) {
  //console.log('jwt verify');
  jwt.verify(req.cookies.yoursso, 'json-secret', function (err, decoded) {
    if (err) {
      return next();
    }
    User.findById(decoded.id)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else if (user === null) {
          var err = new Error('not authorized!');
          err.status = 400;
          res.authorized = false;
          return next();
        } else {
          res.user = user;
          //console.log(res);
          return next();
        }
      });
  });

}

module.exports = jwtVerify;