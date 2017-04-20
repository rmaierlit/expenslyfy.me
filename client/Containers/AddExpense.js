import React, {Component} from 'react';
import axios from 'axios';

class AddExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {amount: '', description: ''};
  }

  handleChange(event) {
    //event bubbling is used to catch onChange events in the parent div
    let key = event.target.getAttribute('data-name');
    let update = {}
    update[key] = event.target.value;
    this.setState(update);
  }

  postExpense() {
    let {amount, description} = this.state;
    if (isNaN(parseFloat(amount))) {
        alert('amount must be a number');
        return;
    }
    let expense = {amount, description, ownerId: this.props.userId};
    axios.post(`/users/${this.props.name}/expenses`, {expense}, {headers: {auth: this.props.token}})
      .then( (res) => {
        console.log(res);
        this.props.updateExpenses(this.props.name);
      });
  }

  render() {
    return (
        <div>
            <h4>Add Expense</h4>
            <div onChange={this.handleChange.bind(this)}>
              amount<input type="text" data-name="amount" value={this.state.amount}/>
              description<input type="text" data-name="description" value={this.state.description}/>
            </div>
            <button onClick={this.postExpense.bind(this)}>Create New Expense</button>
        </div>
    );
  }
}



export default AddExpense;