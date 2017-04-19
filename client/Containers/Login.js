import React, {Component} from 'react';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {user: '', password: ''};
  }

  handleChange(event) {
    //event bubbling is used to catch onChange events in the parent div
    let key = event.target.getAttribute('data-name');
    let update = {}
    update[key] = event.target.value;
    this.setState(update);
  }

  submitLogin() {
    let {user, password} = this.state;
    axios.post('/login', {user, password})
      .then( (res) => {
        let cred = res.data;
        if (cred.token) {
          console.log('token recieved: ', cred.token);
          this.props.setCredentials(cred);
        } else {
          alert('Login information incorrect!');
        }
      });
  }

  render() {
    if (this.props.loggedInAs !== null){
      return (
        <h2>{"Logged In As " + this.props.loggedInAs}</h2>
      )
    }
    return (
        <div>
            <h2>Login:</h2>
            <div onChange={this.handleChange.bind(this)}>
              user name<input type="text" data-name="user" value={this.state.user}/>
              password<input type="text" data-name="password" value={this.state.password}/>
            </div>
            <button onClick={this.submitLogin.bind(this)}>Sign In</button>
        </div>
    );
  }
}



export default Login;