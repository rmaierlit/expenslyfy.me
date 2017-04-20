import React, {Component} from 'react';
import Login from './Login';
import ExpenseView from './ExpenseView';
import ReportView from './ReportView';
import axios from 'axios';

const initialState = {name: null, token:null, isAdmin: false, expenses: null};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  setCredentials(cred){
    this.setState(cred);
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
          this.setState({expenses: res.data});
        });
  }

  render() {
    return (
        <div>
            <h1>Expenslyfy.me</h1>

            <Login setCredentials={this.setCredentials.bind(this)} name={this.state.name}
              clearCredentials={this.clearCredentials.bind(this)}/>

            <ReportView name={this.state.name} token={this.state.token}/>

            <ExpenseView expenseArray={this.state.expenses} token={this.state.token}
              name={this.state.name} isAdmin={this.state.isAdmin} updateExpenses={this.getExpenses.bind(this)}/>
        </div>
    );
  }
}

export default Main;