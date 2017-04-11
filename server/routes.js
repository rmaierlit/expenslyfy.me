var jsonParser = require('body-parser').json();
var helpers = require('./helpers.js');

module.exports = function (server) {
    //*Accessors*
        //GET for user expenses (requires admin or that user)
        server.get('/users/:user/expenses', helpers.getExpenses);
        //GET for single expense (requires admin or that user)
        server.get('/users/:user/expenses/:expenseId', helpers.getAnExpense);

    //*Mutators*
        //POST for user's expense (requires that user)
        server.post('/users/:user/expenses', jsonParser, helpers.createExpense);
        //PUT for user's expense (requires that user)
        server.put('/users/:user/expenses/:expenseId', jsonParser, helpers.updateExpense);
        //DELETE for user's expense (requires that user)
        server.delete('/users/:user/expenses/:expenseId', helpers.deleteExpense);
};