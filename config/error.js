const isProduction = process.env.NODE_ENV === 'production';

// TODO: prolly should create an error page and feed it this data instead
const debugErrorHandler = (err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: err,
        },
    });
};

const productionErrorHandler = (err, req, res, next) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
};

module.exports = isProduction ? productionErrorHandler : debugErrorHandler;