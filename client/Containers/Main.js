import React, {Component} from 'react';
import Login from './Login';
import ExpenseView from './ExpenseView';
import axios from 'axios';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {user: null, token:null, isAdmin: false, expenses: null};
  }

  setCredentials(cred){
    this.setState(cred);
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.user !== null && this.state.user !== prevState.user){
      axios.get(`/users/${this.state.user}/Expenses`, {headers: {auth: this.state.token}})
        .then(res => {
          console.log(res.data);
          this.setState({expenses: res.data});
        });
    }
  }

  render() {
    return (
        <div>
            <h1>Expenslyfy.me</h1>
            <Login setCredentials={this.setCredentials.bind(this)} loggedInAs={this.state.user}/>
            <ExpenseView expenseArray={this.state.expenses}/>
        </div>
    );
  }
}

export default Main;