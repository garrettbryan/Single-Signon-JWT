var mongoose = require('mongoose');

var AffiliateSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  birthday: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  admins: {
    type: [String],
    unique: false,
    required: false,
    trim: true
  },
  position: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  picture: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  url: {
    type: String,
    unique: false,
    required: false,
    trim: true
  }
});

/*
//authenticate input against database
AffiliateSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
AffiliateSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
*/

var User = mongoose.model('Affiliate', AffiliateSchema);
module.exports = User;

