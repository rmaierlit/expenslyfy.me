import React, {Component} from 'react';

function Expenses(props) {
    const expenseArray = props.expenseArray;
    const expenseList = expenseArray.map((expense) => 
        <li key={expense.expense_id.toString()}>
            {[expense.amount, expense.date_time, expense.description].join(" -- ")}
        </li>
    );

    return (
        <ul>
            {expenseList}
        </ul>
    );
}

export default Expenses;