import React, {Component} from 'react';
import Login from './Login';
import ExpenseView from './ExpenseView';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {storedUser: null, storedPassword:null};
  }

  setCredentials(storedUser, storedPassword){
    this.setState({storedUser, storedPassword});
  }

  render() {
    return (
        <div>
            <h1>Expenslyfy</h1>
            <Login/>
            <ExpenseView/>
        </div>
    );
  }
}

export default Main;