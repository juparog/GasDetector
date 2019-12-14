const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'No autorizado.');
    const original_url = req.originalUrl;
    res.render('users/signin', { original_url });
    //res.redirect('/users/signin');
};

module.exports = helpers;