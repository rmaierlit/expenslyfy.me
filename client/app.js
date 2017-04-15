import React from 'react';
import {render} from 'react-dom';
import Main from './Containers/Main';
//import injectTapEventPlugin from 'react-tap-event-plugin';
//injectTapEventPlugin();

render(
  React.createElement(Main),
  document.getElementById('app')
);