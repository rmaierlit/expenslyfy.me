var jwt = require('jsonwebtoken');

var  Helpers = function(m) {
    this.m = m;
    this.myLittleSecret = 'someone who is good at the economy please help me';
};

//middleware to establish differnt levels of permission
Helpers.prototype.adminOnly = function(req, res, next){
    if (!req.user.is_admin) {
        res.send("Invalid: no Admin priviledges");
        return;
    }
    next();
};

Helpers.prototype.userOnly = function(req, res, next){
    if (req.user.name !== req.params.user) {
        res.send("Invalid: not associated user");
        return;
    }
    next();
};

Helpers.prototype.adminOrUser = function(req, res, next){
    if (!req.user.is_admin && req.user.name !== req.params.user) {
        res.send("Invalid: not associated user and no Admin priviledges");
        return;
    }
    next();
};

Helpers.prototype.validateMutation = function(req, res, next){
    let user = req.params.user;
    let expenseId = req.params.expenseId;
    this.m.query('SELECT name FROM users WHERE user_id IN (SELECT owner_id FROM expenses WHERE expense_id=:expenseId)', {expenseId}, function(err, rows) {
        if (err){
            res.send(err.message);
            return;
        } else if (rows.length === 0) {
            res.send("Invalid: this expense cannot be found");
            return;
        } else if (rows[0].name !== user) { //if this expense is owned by a user with a different name that the route you are trying to use 
            res.send('Invalid: this expense is not associated with this user')
            return;
        }
        next();
    });
};


//route endpoints
Helpers.prototype.login = function (req, res){
    let name = req.body.user;
    var secret = this.myLittleSecret;
    this.m.query('SELECT * FROM users WHERE name = :name', {name}, function(err, rows){
        if (err){
            res.send(err.message);
        } else if (rows[0] && rows[0].password === req.body.password){ //TODO: add bcrypt
            let dbName = rows[0].name; //for correct capitalization
            let token = jwt.sign({user: dbName}, secret, {expiresIn: 20 * 60}); //expires in 20 minutes
            res.send({token, name: dbName, userId: rows[0].user_id, isAdmin: rows[0].is_admin === '1'});
        } else {
            res.send(false);
        }
    });
};

Helpers.prototype.getUsers = function(req, res) {
    this.m.query('SELECT name FROM users', function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

Helpers.prototype.getExpenses = function(req, res) {
    let name = req.params.user;
    this.m.query('SELECT * FROM expenses WHERE owner_id IN (select user_id from users where name=:name)', {name}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

Helpers.prototype.getAnExpense = function(req, res) {
    let expenseId = req.params.expenseId;
    let name = req.params.user;
    this.m.query('SELECT * FROM expenses WHERE expense_id = :expenseId AND owner_id IN (select user_id from users where name=:name)', {expenseId, name}, function(err, rows){
        if (err){
            res.send(err.message);
        }
        res.send(rows);
    });
};

Helpers.prototype.getReport = function(req, res) {
    let name = req.params.user;
    let minDate = req.query.minDate; //default should be 'none'
    let maxDate = req.query.maxDate; //default should be 'none'
    //this query groups the expenses that match the provided user ID by what week they belong to (starting from Monday) and provides the sum of the amounts from those groups
    //the dates queried can also be limited by a min and max date provided in the request
    this.m.query(`SELECT DATE_FORMAT(date_time, '%x %v') AS week,
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

Helpers.prototype.createExpense = function(req, res) {
    let {amount, description} = req.body.expense;
    let name = req.params.user;
    // INSERT with SELECT here will specify the first three properties directly and query the users table for the third
    this.m.query('INSERT INTO expenses (date_time, amount, description, owner_id) (SELECT now(), :amount, :description, user_id from users where name=:name)', {amount, description, name}, function(err, info){
        if (err){
            res.send(err.message);
        } else {
            res.send(info);
        }
    })
};

Helpers.prototype.updateExpense = function(req, res) {
    let expense = req.body.expense;
    expense.expenseId = req.params.expenseId;
    this.m.query('UPDATE expenses SET date_time = :dateTime, amount = :amount, description = :description where expense_id = :expenseId', expense, function(err, info){
        if (err){
            res.send(err.message);
        } else {
            res.send(info);
        }
    });
};

Helpers.prototype.deleteExpense = function(req, res) {
    let expenseId = req.params.expenseId;
    this.m.query('DELETE FROM expenses WHERE expense_id = :expenseId', {expenseId}, function(err, info){
        if (err){
            res.send(err.message);
        } else {
            res.send(info);
        }
    });
};

module.exports = Helpers;