import React, {Component} from 'react';
import Expenses from './Expenses.js';
import AddExpense from './AddExpense.js';

class ExpenseView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(!Array.isArray(this.props.expenseArray)){
      return null;
    }
    return (
        <div>
            <h3>Expenses</h3>
            <Expenses expenseArray={this.props.expenseArray}/>
            <AddExpense name={this.props.name} token={this.props.token} 
              updateExpenses={this.props.updateExpenses}/>
        </div>
    );
  }
}

export default ExpenseView;