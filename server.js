const express = require('express');
const partials = require('express-partials');
const app = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const logger = require('./app/services/logging.service');

global.fetch = require('node-fetch');

app.set('port', (process.env.PORT || 5000));

// cookieSession config
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['d932a306-db34-439d-86d4-10a47b7112d8']
}));

app.use(passport.initialize()); // Used to initialize passport
app.use(passport.session()); // Used to persist login sessions

require('./config/passport');

// View setup
app.set('views', __dirname + '/app/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/app/content'));
app.use(favicon(__dirname + '/favicon.ico'));

// Api routes
app.use('/api/v1', require('./app/controllers/api'));

// Routes
app.use(require('./app/controllers'));

// Error handling
app.use(require('./config/error'));

// 404 route
app.use((req, res, next) => {
    res.status(404)
    .render('404', { 
        layout: 'shared/layout', 
        title: global.title, 
        activeTabClass: '.nav-link.home',
        user: req.user
    });
});

const server = app.listen(app.get('port'), function() {
    logger.info(`Node app is running on port ${app.get('port')}`);
});

require('./config/socket.io')(server);