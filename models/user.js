var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    unique: false,
    required: false,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  affiliate: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  acceptTos: {
    type: Number,
    unique: false,
    required: false,
    trim: true
  },
  banned: {
    type: Number,
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
  fullname: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  firstName: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  location: {
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
  signature: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  website: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  aboutme: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        console.log(err);
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
UserSchema.pre('save', function (next) {
  console.log('pre');
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;

