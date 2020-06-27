const optionalRequire = require("optional-require")(require);
const authConfig = optionalRequire('./auth.config.json');
// Required dependencies
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');

// Strategy config
passport.use(new OAuth2Strategy({
    authorizationURL: authConfig.authorization_url,
    tokenURL: authConfig.token_url,
    clientID: authConfig.client_id,
    clientSecret: authConfig.client_secret,
    callbackURL: "http://localhost:5000/auth/callback",
    scope: 'identify email guilds'
  },
  (accessToken, refreshToken, profile, done) => {
    return fetch('https://discord.com/api/users/@me',{
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      }).then((response) => {
          if (!response.ok) {
              throw Error(response.statusText);
          }
          return response;
      })
      .then(res => res.json())
      .then(user => done(null, Object.assign(user, {accessToken, refreshToken})))
      .catch(err => done(err, false));
  }
));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
    done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
    done(null, user);
});
