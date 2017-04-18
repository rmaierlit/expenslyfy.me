import React, {Component} from 'react';

function Expenses(props) {
    const expenseArray = props.expenseArray;
    const expenseList = expenseArray.map((expense) => 
        <li key={expense.owner_id.toString()}>
            {"placeholder"}
        </li>
    );

    return (
        <ul>
            {expenseList}
        </ul>
    );
}

export default Expenses;