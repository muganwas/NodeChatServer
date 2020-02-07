'use strict';
module.exports = app => {
    // var details = require('./Controllers/userDetailsController');
    //details routes
    app.route('/')
        .post((req, res) => {
            // console.log(req)
            res.json({message:'received'})
        })
        .get((req, res) => {
            // console.log(req);
            res.json({message:'received'})
        });
}