var jsonParser = require('body-parser').json();
var helpers = require('./helpers.js');

module.exports = function (server) {
    //*Accessors*
        //GET for user expenses (requires admin or that user)
        server.get('/:user', helpers.getExpenses);
        //GET for single expense (requires admin or that user)
        server.get('/:user/:expenseId', helpers.getAnExpense);

    //*Mutators*
        //POST for user's expense (requires that user)
        server.post('/:user', jsonParser, helpers.createExpense);
        //PUT for user's expense (requires that user)
        server.put('/:user/:expenseId', jsonParser, helpers.updateExpense);
        //DELETE for user's expense (requires that user)
        server.delete('/:user/:expenseId', helpers.deleteExpense);
};