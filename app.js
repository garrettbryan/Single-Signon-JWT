const createError = require('http-errors');
const express = require('express');

// const fs    = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const nconf = require('nconf');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const profileRouter = require('./routes/profile');
const logoutRouter = require('./routes/logout');
const affiliatesRouter = require('./routes/affiliates');
const contributorsRouter = require('./routes/contributors');

const app = express();

mongoose.Promise = require('bluebird');

nconf.env()
  .argv()
  .file({ file: 'config.json' });


mongoose.connect(nconf.get('mongo:uri'),
  { useNewUrlParser: true });

const db = mongoose.connection;

// handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
// we're connected!
});

// use sessions for tracking logins
app.use(session({
  secret: nconf.get('secret'),
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: db }),
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger(nconf.get('logStyle')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.use(require('./middleware/jwt-verify'));
app.use('/contributors', contributorsRouter);
app.use('/profile', profileRouter);
app.use('/logout', logoutRouter);
app.use('/affiliates', affiliatesRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
