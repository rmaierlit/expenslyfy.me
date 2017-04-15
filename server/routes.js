var jsonParser = require('body-parser').json();
var helpers = require('./helpers.js');

module.exports = function (server) {
    //*Authorization
    server.post('/login', helpers.login);

    //*Accessors*

    //GET for user expenses (requires admin or that user)
    server.get('/users/:user/expenses', helpers.isAuthenticated, helpers.adminOrUser, helpers.getExpenses);
    //GET for single expense (requires admin or that user)
    server.get('/users/:user/expenses/:expenseId', helpers.isAuthenticated, helpers.adminOrUser, helpers.getAnExpense);

    //*Mutators*

    //POST for user's expense (requires that user)
    server.post('/users/:user/expenses', jsonParser, helpers.isAuthenticated, helpers.userOnly, helpers.createExpense);
    //PUT for user's expense (requires that user)
    server.put('/users/:user/expenses/:expenseId', jsonParser, helpers.isAuthenticated, helpers.userOnly, helpers.updateExpense);
    //DELETE for user's expense (requires that user)
    server.delete('/users/:user/expenses/:expenseId', helpers.isAuthenticated, helpers.userOnly, helpers.deleteExpense);
};