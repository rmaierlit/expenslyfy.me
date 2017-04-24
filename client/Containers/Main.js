import React, {Component} from 'react';
import Login from './Login';
import ExpenseView from './ExpenseView';
import ReportView from './ReportView';
import axios from 'axios';

const initialState = {name: null, token:null, isAdmin: false, expenses: null, userList: null, lookingAt: null};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  setCredentials(cred){
    cred.lookingAt = cred.name;
    if(cred.isAdmin){
      axios.get('/users', {headers: {auth: cred.token}})
        .then(res => {
          console.log('get userList', res.data);
          cred.userList = res.data
          this.setState(cred);
        });
    } else{
    this.setState(cred);
    }
  }

  clearCredentials(){
    this.setState(initialState);
  }

  componentDidUpdate(prevProps, prevState){
    if (this.state.name !== null && this.state.name !== prevState.name){
      this.getExpenses(this.state.name);
    }
  }

  getExpenses(userName){
    axios.get(`/users/${userName}/expenses`, {headers: {auth: this.state.token}})
        .then(res => {
          console.log('get exps:', res.data);
          this.setState({expenses: res.data, lookingAt: userName});
        });
  }

  deleteExpense(expenseId) {
    axios.delete(`/users/${this.state.name}/expenses/${expenseId}`, {headers: {auth: this.state.token}})
      .then(res => {
        console.log('deleted: ', res.data);
        this.getExpenses(this.state.name);
      });
  }

  render() {
    return (
        <div>
            <h1>Expenslyfy.me</h1>

            <Login setCredentials={this.setCredentials.bind(this)} name={this.state.name}
              clearCredentials={this.clearCredentials.bind(this)}/>

            <ReportView name={this.state.name} token={this.state.token}/>

            <ExpenseView expenseArray={this.state.expenses} token={this.state.token} userList={this.state.userList}
              name={this.state.name} isAdmin={this.state.isAdmin} lookingAt={this.state.lookingAt}
              getExpenses={this.getExpenses.bind(this)} deleteExpense={this.deleteExpense.bind(this)}/>
        </div>
    );
  }
}

export default Main;