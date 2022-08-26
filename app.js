const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

require('dotenv').config();

const app = express();

// enable cors
app.use(cors({
  origin: process.env.FRONTEND_URL, // Sets Access-Control-Allow-Origin. Can be set to Boolean (True=request origin, False=cors disabled), RegExp, Array, or Function returning origin. Default: "*".
  credentials: true, // Sets Access-Control-Allow-Credentials: true. Default: Credentials, if sent by the server, would be ignored by the client.
  exposedHeaders: ['set-cookie'] // Sets Access-Control-Expose-Headers. Default: only CORS safe headers can be read by client side JS.
}));

app.use(logger('dev'));
app.use(express.json()); // parses the text-based request body for Content-Type: application/json and exposes it on req.body.
app.use(express.urlencoded({ extended: false })); // parses x-www-form-urlencoded form data (e.g., querystring is /endpoint?user=bob&password=1234). extended: false => nested objects not parsed.

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // Don't save the session back to session store if it is not modified (default: true).
  saveUninitialized: false, // Don't save unmodified sessions (default: true).
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
  cookie: {
      maxAge: 36000000, // Delete this cookie after 10 hours on client side (default: null).
      httpOnly: false, // Allow cookies to be accessible through client side script (default: true).
  },
  secure: false,
}));

const authRouter = require('./routes/auth');
const channelsRouter = require('./routes/channels');
const messagesRouter = require('./routes/messages');
const usersRouter = require('./routes/users');

app.use('/auth', authRouter);
app.use('/channels', channelsRouter);
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);

mongoose.connect(process.env.MONGODB_URL);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send({ error });
});

module.exports = app;