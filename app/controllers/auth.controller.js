const express = require('express');
const router = express.Router();
const passport = require('passport');

// passport.authenticate middleware is used here to authenticate the request
router.get('/auth', passport.authenticate('oauth2', {
    scope: ['identify', 'email', ' guilds'], // Used to specify the required data
    prompt: 'none',
    session: true
}));

// The middleware receives the data from Google and runs the function on Strategy config
router.get('/auth/callback', passport.authenticate('oauth2', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

// Login route
router.get('/login', (req, res) => {
	res.render('login', { 
        layout: 'shared/layout', 
        title: global.title, 
        activeTabClass: '.nav-link.home',
        user: req.user
    });
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout(); 
    res.redirect('/login');
});

module.exports = router;