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

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromHeader("auth");
opts.secretOrKey = myLittleSecret;
passport.use(new Strategy(opts, function(jwt_payload, done) {
    m.query('SELECT * FROM users WHERE name = :name', {name: jwt_payload.user}, function(err, rows){
        if (err) {
            return done(err, false);
        }
        if (rows.length === 1) { //user should be sole element in an array
            done(null, rows[0]);
        } else {
            done(null, false);
        }
    });
}));

var helpers = {};

helpers.isAuthenticated = passport.authenticate('jwt', {session : false});

//middleware to establish differnt levels of permission
helpers.adminOnly = function(req, res, next){
    if (!req.user.is_admin) {
        res.send("Invalid: no Admin priviledges");
    }
    next();
};

helpers.userOnly = function(req, res, next){
    if (req.user.name !== req.params.user) {
        res.send("Invalid: not associated user");
    }
    next();
};

helpers.adminOrUser = function(req, res, next){
    if (!req.user.is_admin && req.user.name !== req.params.user) {
        res.send("Invalid: not associated user and no Admin priviledges");
    }
    next();
};

//route endpoints
helpers.login = function (req, res){
    let name = req.body.user;
    m.query('SELECT * FROM users WHERE name = :name', {name}, function(err, rows){
        if (rows[0] && rows[0].password === req.body.password){ //TODO: add bcrypt
            let token = jwt.sign({user: name}, myLittleSecret, {expiresIn: 5 * 60}); //expires in 5 minutes
            res.send({token, name, userId: rows[0].user_id, isAdmin: rows[0].is_admin});
        } else {
            res.send(false);
        }
    });
};

helpers.getExpenses= function(req, res) {
    let userName = req.params.user;
    m.query('SELECT expense_id, date_time, amount, description, owner_id FROM expenses LEFT JOIN users ON expenses.owner_id = users.user_id WHERE name = :userName;', {userName}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.getAnExpense = function(req, res) {
    let expenseId = req.params.expenseId;
    m.query('SELECT * FROM expenses WHERE expense_id = :expenseId', {expenseId}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.createExpense = function(req, res) {
    let expense = req.body.expense;
    m.query('INSERT INTO expenses (date_time, amount, description, owner_id) VALUES (now(), :amount, :description, :ownerId)', expense, function(err, info){
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
    m.query('UPDATE expenses SET date_time = :dateTime, amount = :amount, description = :description, owner_id = :ownerId where expense_id = :expenseId', expense, function(err, info){
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