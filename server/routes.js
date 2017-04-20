var jsonParser = require('body-parser').json();
var helpers = require('./helpers.js');

module.exports = function (server) {
    //*Authorization
    server.post('/login', jsonParser, helpers.login);

    //*Accessors*

    //GET for a list of users (requires admin)
    server.get('/users', helpers.isAuthenticated, helpers.adminOnly, helpers.getUsers);
    //GET for user expenses (requires admin or that user)
    server.get('/users/:user/expenses', helpers.isAuthenticated, helpers.adminOrUser, helpers.getExpenses);
    //GET for single expense (requires admin or that user)
    server.get('/users/:user/expenses/:expenseId', helpers.isAuthenticated, helpers.adminOrUser, helpers.getAnExpense);
    //GET for expense report (requires that user)
    server.get('/users/:user/report', helpers.isAuthenticated, helpers.userOnly, helpers.getReport);

    //*Mutators*

    //POST for user's expense (requires that user)
    server.post('/users/:user/expenses', jsonParser, helpers.isAuthenticated, helpers.userOnly, helpers.createExpense);
    //PUT for user's expense (requires that user)
    server.put('/users/:user/expenses/:expenseId', jsonParser, helpers.isAuthenticated, helpers.userOnly, helpers.validateMutation, helpers.updateExpense);
    //DELETE for user's expense (requires that user)
    server.delete('/users/:user/expenses/:expenseId', helpers.isAuthenticated, helpers.userOnly, helpers.validateMutation, helpers.deleteExpense);
};