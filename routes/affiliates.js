var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Affiliate = require('../models/affiliate');
const nconf = require('nconf');


/* GET home page. */
router.get('/', function(req, res, next) {
  Affiliate.find({}, function (err, docs) {
    if (err) {
      return next(err);
    }
    res.render('affiliates',
      {
        docs: docs,
        user: res.user,
        googleMaps: nconf.get('googleMaps')
      }
    );
  });
});

router.post('/new', function(req, res, next) {
  Affiliate.create(req.body, (error, affiliate) => {
    if (error) {
        return next(error);
    }
    console.log(affiliate);
    res.redirect('/affiliates');
  });
});

router.post('/update', function (req, res, next) {
  Affiliate.findByIdAndUpdate(decoded.id, req.body, function (error, affiliate) {
    if (error) {
      return next(error);
    }
    console.log(affiliate);
    res.send(affiliate);
  });
});

module.exports = router;
