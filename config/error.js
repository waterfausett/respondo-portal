function censor(censor) {
    var i = 0;
  
    return function(key, value) {
      if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
        return '[Circular]'; 
  
      if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
        return '[Unknown]';
  
      ++i; // so we know we aren't using the original object anymore
  
      return value;  
    }
}

module.exports = (err, req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isApiRequest = req.path.startsWith('/api');

    res.status(err.status || 500);

    if (isApiRequest) {
        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    }
    else {
        res.render('error', { 
            layout: 'shared/layout', 
            title: global.title, 
            activeTabClass: '.nav-link.home',
            user: req.user,
            error: {
                message: err.message,
                details: !isProduction ? JSON.stringify(err, censor(err), 2) : null
            }
        });
    }
};