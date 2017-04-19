import React, {Component} from 'react';
import axios from 'axios';
import Expenses from './Expenses.js'

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
        </div>
    );
  }
}

export default ExpenseView;