import React, {Component} from 'react';
import axios from 'Axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};
  }

  handleChange(event) {
    //event bubbling is used to catch onChange events in the parent div
    let key = event.target.getAttribute('data-name');
    let update = {}
    update[key] = event.target.value;
    this.setState(update);
  }

  submitLogin() {
    axios.post('/login', {
      username: this.state.usersname,
      password: this.state.password,
    }).then( (res) => console.log(res))
      .catch( (err) => console.log(err));
  }

  render() {
    return (
        <div>
            <h2>Login:</h2>
            <div onChange={this.handleChange.bind(this)}>
              username<input type="text" data-name="username" value={this.state.username}/>
              password<input type="text" data-name="password" value={this.state.password}/>
            </div>
            <button onClick={this.submitLogin}>Submit</button>
        </div>
    );
  }
}



export default Login;