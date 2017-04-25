var jsonParser = require('body-parser').json();
var Helpers = require('./helpers.js');
var Maria = require('mariasql');
var passport = require('passport');
var {Strategy, ExtractJwt} = require('passport-jwt');

var m = Maria({
        host: 'localHost',
        user: 'root',
        db: 'app'
});

var helpers = new Helpers(m); //injecting dependency
helpers.isAuthenticated = passport.authenticate('jwt', {session: false});

//configure passport-jwt authentication
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromHeader("auth");
opts.secretOrKey = helpers.myLittleSecret;
passport.use(new Strategy(opts, function(jwt_payload, done) {
    m.query('SELECT * FROM users WHERE name = :name', {name: jwt_payload.user}, function(err, rows){
        if (err) {
            return done(err, false);
        }
        if (rows.length !== 0) { //if length is zero, user is not in database
            done(null, rows[0]);
        } else {
            done(null, false);
        }
    });
}));

module.exports = function (server) {
    //*Authorization
    server.post('/login', jsonParser, helpers.login.bind(helpers));

    //*Accessors*
    //GET for a list of users (requires admin)
    server.get('/users', helpers.isAuthenticated, helpers.adminOnly, helpers.getUsers.bind(helpers));
    //GET for user expenses (requires admin or that user)
    server.get('/users/:user/expenses', helpers.isAuthenticated, helpers.adminOrUser, helpers.getExpenses.bind(helpers));
    //GET for single expense (requires admin or that user)
    server.get('/users/:user/expenses/:expenseId', helpers.isAuthenticated, helpers.adminOrUser, helpers.getAnExpense.bind(helpers));
    //GET for expense report (requires that user)
    server.get('/users/:user/report', helpers.isAuthenticated, helpers.userOnly, helpers.getReport.bind(helpers));

    //*Mutators*
    //POST for user's expense (requires that user)
    server.post('/users/:user/expenses', jsonParser, helpers.isAuthenticated, helpers.userOnly, helpers.createExpense.bind(helpers));
    //PUT for user's expense (requires that user)
    server.put('/users/:user/expenses/:expenseId', jsonParser, helpers.isAuthenticated, helpers.userOnly, helpers.validateMutation.bind(helpers), helpers.updateExpense.bind(helpers));
    //DELETE for user's expense (requires that user)
    server.delete('/users/:user/expenses/:expenseId', helpers.isAuthenticated, helpers.userOnly, helpers.validateMutation.bind(helpers), helpers.deleteExpense.bind(helpers));
};