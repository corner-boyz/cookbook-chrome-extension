/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import IP from '../IP';
import axios from 'axios';
//==================================================== 
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      wrongEmailOrPass: false, 
    }
  }
  //====================================================
  componentDidMount() {
  }
  //====================================================
  redirectToSignup(){
    this.props.changeScreen('signup');
  }
  
  submitLogin() {
    if (this.state.email.length) {
      axios.post(`http://${IP}/api/login`, {
        email: this.state.email,
        password: this.state.password,
      }).then(results => {
        if (results.data === 'Wrong email or password') {
          this.setState({
            wrongEmailOrPass: true,
          });
        } else {
          let { email, name } = results.data;
          chrome.storage.sync.set({
            'isLoggedIn': true,
            'email': email,
            'name': name
          });
          this.props.changeScreen('ingredients');
        }
      }).catch(error => {
        console.log('Error in validating user login:', error);
      });
    }
  }

  updateEmail(e) {
    this.setState({
      email: e.target.value,
      wrongEmailOrPass: false,
    });
  }

  updatePassword(e) {
    this.setState({
      password: e.target.value,
      wrongEmailOrPass: false,
    });
  }

  //====================================================
  render() {
    return (
      <div>
        <p>Log in to your CookBook account:</p>
        <TextField
          style={{ height: 40, width: 250 }}
          placeholder='Email'
          onChange={this.updateEmail.bind(this)}
          inputProps={{style: styles.textField}}
          />
        {this.state.wrongEmailOrPass
          ? (<p style={styles.warningText}>Wrong email or password.</p>)
          : (null)}
        <TextField
          style={{ height: 40, width: 250 }}
          type='password'
          placeholder='Password'
          secureTextEntry={true}
          onChange={this.updatePassword.bind(this)}
          inputProps={{style: styles.textField}}
        />
        <Button 
          variant='contained' 
          color='primary'
          size='small'
          onClick={this.submitLogin.bind(this)}>
        Log In 
        </Button>
        <p>
          Don't have an account?
        </p>
        <Button 
          variant='contained' 
          color='secondary'
          size='small'
          onClick={this.redirectToSignup.bind(this)}
          >
        Sign Up
        </Button>
      </div>
    )
  }
}
//==================================================== 
const styles = {
  textField:{
    fontSize: 12
  },
  warningText: {
    color: '#ff0000'
  }
}

export default Login;