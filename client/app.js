import React from 'react';
import {render} from 'react-dom';
import {Router, Route, browserHistory, hashHistory} from 'react-router';
import Main from './Containers/Main';
import Login from './Containers/Login';
import ExpenseView from './Containers/ExpenseView';
//import injectTapEventPlugin from 'react-tap-event-plugin';
//injectTapEventPlugin();

render(
  <Router history={hashHistory}>
    <Route component={Main}>
      <Route path='/' component={Login}/>
      <Route path='/expense-view' component={ExpenseView}/>
    </Route>
  </Router>,
  document.getElementById('app')
);