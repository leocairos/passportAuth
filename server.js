const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const socketio = require('socket.io')

function getCorsOrigin() {
  //const origin = process.env.CORS_ORIGIN;
  //const origin = 'https://localhost:8088';
  const origin = '*';
  if (!origin) throw new Error('CORS_ORIGIN is a required env var.');

  if (origin === '*') return origin;

  return new RegExp(origin);
}

const corsOptions = {
  origin: getCorsOrigin(),
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;

const https = require('https');
const http = require('http');
const fs = require('fs');

const routes = require('./routes.js');
const config = require('./config')

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

function passportFunc(accessToken, refreshToken, profile, done) {
  console.log('profile', profile)
  return done(null, profile);
}
/*  Facebook AUTH  */
passport.use(new FacebookStrategy({
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL,
  profileFields: ['id', 'displayName', 'name', 'emails', 'picture.type(large)']
}, passportFunc));

passport.use(new GoogleStrategy({
  clientID: config.googleAuth.clientID,
  clientSecret: config.googleAuth.clientSecret,
  callbackURL: config.googleAuth.callbackURL
}, passportFunc));

passport.use(new LinkedInStrategy({
  clientID: config.linkedinAuth.clientID,
  clientSecret: config.linkedinAuth.clientSecret,
  callbackURL: config.linkedinAuth.callbackURL,
  scope: ['r_emailaddress', 'r_liteprofile'],
}, passportFunc));

passport.use(new MicrosoftStrategy({
  clientID: config.microsoftAuth.clientID,
  clientSecret: config.microsoftAuth.clientSecret,
  callbackURL: config.microsoftAuth.callbackURL,
  scope: ['user.read']
}, passportFunc));

app.use('/', routes);


// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app);

httpServer.listen(8080, () => {
  console.log('HTTP Server running on port 8080');
});

httpsServer.listen(3000, () => {
  console.log('HTTPS Server running on port 3000');
});

// Connecting sockets to the server and adding them to the request 
// so that we can access them later in the controller
const io = socketio(httpsServer)
app.set('io', io)