const passport = require('passport');
const express = require('express');
var router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

router.get('/', function (req, res) {
  res.render('pages/index.ejs'); // load the index.ejs file
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/profile', isLoggedIn, function (req, res) {
  res.render('pages/profile.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

router.get('/error', isLoggedIn, function (req, res) {
  res.render('pages/error.ejs');
});

//-----GOOGLE --------------
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/profile',
//     failureRedirect: '/error'
//   }));

// Setting up the passport middleware for each of the OAuth providers
const googleAuth = passport.authenticate('google', { scope: ['profile'] })

const authController = require('./auth.controller')

// Routes that are triggered by the callbacks from each OAuth provider once 
// the user has authenticated successfully
router.get('/auth/google/callback', googleAuth, authController.google)

//-----FACEBOOK --------------
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/error'
  }));

//-----LINKEDIN --------------
router.get('/auth/linkedin', passport.authenticate('linkedin', {
  scope: ['r_emailaddress', 'r_liteprofile'],
}));

router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

//-----MICROSOFT --------------
router.get('/auth/microsoft',
  passport.authenticate('microsoft'));

router.get('/auth/microsoft/callback',
  passport.authenticate('microsoft', {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }));

module.exports = router;