var passport = require('passport');
var {Strategy, ExtractJwt} = require('passport-jwt');
var jwt = require('jsonwebtoken');
var Maria = require('mariasql');

var m = Maria({
        host: 'localHost',
        user: 'root',
        db: 'app'
});

const myLittleSecret = 'someone who is good at the economy please help me';

//implements passport-jwt authentication
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromHeader("auth");
opts.secretOrKey = myLittleSecret;
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

var helpers = {};

helpers.isAuthenticated = passport.authenticate('jwt', {session: false});

//middleware to establish differnt levels of permission
helpers.adminOnly = function(req, res, next){
    if (!req.user.is_admin) {
        res.send("Invalid: no Admin priviledges");
        return;
    }
    next();
};

helpers.userOnly = function(req, res, next){
    if (req.user.name !== req.params.user) {
        res.send("Invalid: not associated user");
        return;
    }
    next();
};

helpers.adminOrUser = function(req, res, next){
    if (!req.user.is_admin && req.user.name !== req.params.user) {
        res.send("Invalid: not associated user and no Admin priviledges");
        return;
    }
    next();
};

helpers.validateMutation = function(req, res, next){
    let user = req.params.user;
    let expenseId = req.params.expenseId;
    m.query('SELECT name FROM user WHERE user_id IN (SELECT owner_id FROM expenses WHERE expense_id=:expenseId', {expenseId}, function(err, row) {
        if (row.length === 0) {
            res.send("Invalid: this expense cannot be found");
            return;
        }
        if (row[0].name !== user) { //if this expense is owned by a user with a different name that the route you are trying to use 
            res.send("Invalid: this expense is not associated with this user")
            return;
        }
        next();
    });
};


//route endpoints
helpers.login = function (req, res){
    let name = req.body.user;
    m.query('SELECT * FROM users WHERE name = :name', {name}, function(err, rows){
        if (rows[0] && rows[0].password === req.body.password){ //TODO: add bcrypt
            let dbName = rows[0].name; //for correct capitalization
            let token = jwt.sign({user: dbName}, myLittleSecret, {expiresIn: 20 * 60}); //expires in 20 minutes
            res.send({token, name: dbName, userId: rows[0].user_id, isAdmin: rows[0].is_admin === '1'});
        } else {
            res.send(false);
        }
    });
};

helpers.getUsers = function(req, res) {
    m.query('SELECT name FROM users', function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.getExpenses = function(req, res) {
    let name = req.params.user;
    m.query('SELECT * FROM expenses WHERE owner_id IN (select user_id from users where name=:name)', {name}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.getAnExpense = function(req, res) {
    let expenseId = req.params.expenseId;
    let name = req.params.user;
    m.query('SELECT * FROM expenses WHERE expense_id = :expenseId AND owner_id IN (select user_id from users where name=:name)', {expenseId, name}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.getReport = function(req, res) {
    let name = req.params.user;
    let minDate = req.query.minDate; //default should be 'none'
    let maxDate = req.query.maxDate; //default should be 'none'
    console.log(req.query);
    //this query groups the expenses that match the provided user ID by what week they belong to (starting from Monday) and provides the sum of the amounts from those groups
    //the dates queried can also be limited by a min and max date provided in the request
    m.query(`SELECT DATE_FORMAT(date_time, '%x %v') AS week,
             DATE(DATE_ADD(date_time, INTERVAL(-WEEKDAY(date_time)) DAY)) as week_start,
             DATE(DATE_ADD(date_time, INTERVAL(-WEEKDAY(date_time) + 6) DAY)) as week_end,
             SUM(expenses.amount) AS total_amount_spent FROM expenses
             WHERE owner_id IN (select user_id from users where name=:name)
             AND (:minDate='none' OR TIMEDIFF(date_time, :minDate) >= 0)
             AND (:maxDate='none' OR TIMEDIFF(date_time, :maxDate) <= 0)
             GROUP BY week`, {name, minDate, maxDate}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.createExpense = function(req, res) {
    let {amount, description} = req.body.expense;
    let name = req.params.user;
    // INSERT with SELECT here will specify the first three properties directly and query the users table for the third
    m.query('INSERT INTO expenses (date_time, amount, description, owner_id) (SELECT now(), :amount, :description, user_id from users where name=:name)', {amount, description, name}, function(err, info){
        if (err){
            res.send(err.message);
        } else {
            res.send(info);
        }
    })
};

helpers.updateExpense = function(req, res) {
    let expense = req.body.expense;
    expense.expenseId = req.params.expenseId;
    m.query('UPDATE expenses SET date_time = :dateTime, amount = :amount, description = :description where expense_id = :expenseId', expense, function(err, info){
        if (err){
            res.send(err.message);
        } else {
            res.send(info);
        }
    });
};

helpers.deleteExpense = function(req, res) {
    let expenseId = req.params.expenseId;
    m.query('DELETE FROM expenses where expense_id = :expenseId', {expenseId}, function(err, info){
        if (err){
            res.send(err.message);
        } else {
            res.send(info);
        }
    });
};

module.exports = helpers;