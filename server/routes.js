var jsonParser = require('body-parser').json();

module.exports = function (server, express) {
    //*Accessors*
    //GET for user expenses (requires admin or that user)
    server.get('/:user', helpers.getExpenses)
    //GET for single expense (requires admin or that user)
    server.get('/:user/:expenseId', helpers.getAnExpense)

    //*Mutators*
    //POST for user's expense (requires that user)
    server.post('/:user/:expenseId', helpers.createExpense)
    //PUT for user's expense (requires that user)
    server.put('/:user/:expenseId', helpers.updateExpense)
    //DELETE for user's expense (requires that user)
    server.delete('/:user/:expenseID', helpers.deleteExpense);
};