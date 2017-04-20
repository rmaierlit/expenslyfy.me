import React, {Component} from 'react';
import Expenses from './Expenses.js';
import AddExpense from './AddExpense.js';
import LookupUser from './LookupUser.js';

function ExpenseView(props) {
  if(!Array.isArray(props.expenseArray)){
    return null;
  }
  return (
      <div>
          <h3>Expenses</h3>
          <LookupUser userList={props.userList} getExpenses={props.getExpenses}/>
          <Expenses expenseArray={props.expenseArray}/>
          <AddExpense name={props.name} token={props.token} updateExpenses={props.getExpenses} lookingAt={props.lookingAt}/>
      </div>
  );
}

export default ExpenseView;