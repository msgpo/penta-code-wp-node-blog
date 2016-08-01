var WP = require('wordpress-rest-api');
var get = require('lodash.get');

module.exports = function(req, res, next) {
    const wp = new WP({
        endpoint: '//YOUR_SERVER/wp-json',
        // This assumes you are using basic auth
        username: 'YOUR_WP_USERNAME',
        password: 'YOUR_WP_PASSWORD',
        auth: true
    });

    // request configuration
    const itemsPerPage = get(req, 'query.perPage') || 12;
    const page = get(req, 'query.page') || 1;
    const statusFilter = get(req, 'query.status') || 'publish';

    wp.posts().param({
        status: statusFilter
    }).embed().perPage(itemsPerPage).page(page).then((data) => {
        if (data) {
            res.locals.postList = data;
        }
        next();
    }).catch((error) => {
        res.render('500', {
            status: error|| 500,
            error: error
        });
        res.status(500);
    });
};