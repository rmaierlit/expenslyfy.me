var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var Maria = require('mariasql');

var m = Maria({
        host: 'localHost',
        user: 'root',
        db: 'app'
});

passport.use(new Strategy(
    function(username, password, cb) {
        m.query('SELECT * FROM users where name = :username'), {username}, function(err, rows){
            if (err){
                return cb(err);
            }
            
            //if there is no matching user in the database, return false
            if (rows.length = 0){
                return cb(null, false);
            }
            
            let user = rows[0];

            //if the password does not match, return false (TODO: implement hashing crypto)
            if (password !== user.password){
                return cb(null, false);
            }

            return cb(null, user);
        }
    }
));

var helpers = {};

helpers.isAuthenticated = passport.authenticate('basic', {session : false});

helpers.adminOnly = function(req, res, next){
    if (!req.user.is_admin) {
        res.send("Invalid: no Admin priviledges");
    }
    next();
}

helpers.userOnly = function(req, res, next){
    if (req.user !== req.params.user) {
        res.send("Invalid: not associated user");
    }
    next();
}

helpers.adminOrUser = function(req, res, next){
    if (!req.user.is_admin && req.user !== req.params.user) {
        res.send("Invalid: not associated user and no Admin priviledges");
    }
    next();
}

helpers.getExpenses= function(req, res) {
    let userName = req.params.user;
    m.query('SELECT date_time, amount, description, owner_id FROM expenses LEFT JOIN users ON expenses.owner_id = users.user_id where name = :userName;', {userName}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.getAnExpense = function(req, res) {
    let expenseId = req.params.expenseId;
    m.query('SELECT * FROM expenses where expense_id = :expenseId', {expenseId}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

helpers.createExpense = function(req, res) {
    let expense = req.body.expense;
    m.query('INSERT INTO expenses (date_time, amount, description, owner_id) VALUES (:date_time, :amount, :description, :ownerId)', expense, function(err, info){
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