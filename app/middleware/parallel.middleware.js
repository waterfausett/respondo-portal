const async = require('async');

function parallel(middlewares) {
    return (req, res, next) => {
        async.each(middlewares, (mw, cb) => {
            mw(req, res, cb);
        }, next);
    };
}

module.exports = parallel;