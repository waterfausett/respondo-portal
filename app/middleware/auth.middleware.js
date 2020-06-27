module.exports = {
    required: (req, res, next) => {
        if (req.isAuthenticated()) {
          return next()
        }
        res.statusMessage = 'Unauthorized';
        res.status(401).end();
    },
    optional: (req, res, next) => next()
}