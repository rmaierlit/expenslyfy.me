import React, {Component} from 'react';
import axios from 'axios';

function Expenses(props) {
    const expenseArray = props.expenseArray;
    const displayDelete = props.isOwn? 'inital': 'none';
    const expenseList = expenseArray.map((expense) => 
        <li key={expense.expense_id.toString()}>
            {[expense.amount, expense.date_time, expense.description].join(" -- ")}
            <button className="delete" data-expenseId={expense.expense_id.toString()} style={{marginLeft: '10px', display: displayDelete}}>x</button>
        </li>
    );

    var handleClick = function(event) {
        if (event.target.classList.contains('delete')){
            let expenseId = event.target.getAttribute("data-expenseId");
            props.deleteExpense(expenseId);
        };
    };

    return (
        <ul onClick={handleClick}>
            {expenseList}
        </ul>
    );
}

export default Expenses;