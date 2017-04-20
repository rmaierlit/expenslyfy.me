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
          this.props.setCredentials(cred);
          this.setState({user: '', password: ''});
        } else {
          alert('Login information incorrect!');
        }
      });
  }

  render() {
    if (this.props.name !== null){
      return (
        <div style={{display: 'flex'}}>
          <h2>{"Logged In As " + this.props.name}</h2>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <button onClick={this.props.clearCredentials}>Logout</button>
          </div>
        </div>
      )
    }
    return (
        <div>
            <h2>Login:</h2>
            <div onChange={this.handleChange.bind(this)}>
              username<input type="text" data-name="user" value={this.state.user}/>
              password<input type="text" data-name="password" value={this.state.password}/>
            </div>
            <button onClick={this.submitLogin.bind(this)}>Sign In</button>
        </div>
    );
  }
}



export default Login;