var helpers = {};

var Maria = require('mariasql');

var m = Maria({
        host: 'localHost',
        user: 'root',
        db: 'app'
});

helpers.getExpenses= function(req, res) {
    let userName = req.params.user;
    m.query('SELECT * FROM expenses LEFT JOIN users ON expenses.owner_id = users.user_id where name = :userName;', {userName}, function(err, rows){
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