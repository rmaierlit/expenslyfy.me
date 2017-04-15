import React, {Component} from 'react';
import Login from './Login';
import ExpenseView from './ExpenseView';
import {HashRouter, Route, link} from 'react-router-dom';

class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
            <h1>Expenslyfy</h1>
            <HashRouter>
              <div>
                <Route exact path='/' component={Login}/>
                <Route path='/expense-view' component={ExpenseView}/>
              </div>
            </HashRouter>
        </div>
    );
  }
}

export default Main;