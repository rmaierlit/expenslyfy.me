import React, {Component} from 'react';
import axios from 'axios';
import Expenses from './Expenses.js'

class ExpenseView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    axios.request({url: '/users/Wint/Expenses', auth: {username: 'Wint', password: 'dril'}})
      .then((res) => console.log(res));
  }

  render() {
    const testList = [{owner_id: 0}, {owner_id: 1}];
    return (
        <div>
            <h3>expenses</h3>
            <Expenses expenseArray={testList}/>
        </div>
    );
  }
}

export default ExpenseView;