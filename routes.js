'use strict';
module.exports = app => {
    var details = require('./Controllers/userDetailsController');
    //details routes
    app.route('/api/v1/user')
        .post(details.processUser)
        .get(details.processUser);
}