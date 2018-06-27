import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';
import IP from '../IP';

//==================================================== 
class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
        noEmail: false,
        notMatching: false,
        tooShort: false,
    }
    //this.submitSignup = this.submitSignup.bind(this);
}
//==================================================== NavBar component
  // static navigationOptions = {
  //   tabBarColor: 'green',
  //   tabBarIcon: () => {
  //     return <Ionicons name='ios-basket' size={25} color='white' />;
  //   },
  // }
//====================================================
  componentDidMount() {
  }

  submitSignup() {
    this.setState({
        noEmail: this.state.email.indexOf('@') === -1,
        notMatching: this.state.password !== this.state.confirmedPassword,
        tooShort: this.state.password.length < 6,
    });
    if (!this.state.noEmail && !this.state.notMatching && !this.state.tooShort) {
        axios.post(`http://${IP}/api/signup`, {
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
          })
          .then(() => {
            //Redirect to home page
          }).catch(error => {
            console.log('Error in creating new user:', error);
          });
    }
  }

  updateName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  updateEmail(e) {
    this.setState({
      email: e.target.value,
      noEmail: false,
    });
  }

  updatePassword(e) {
    this.setState({
      password: e.target.value,
      tooShort: false,
    });
  }

  updateConfirmedPassword(e) {
    this.setState({
      confirmedPassword: e.target.value,
      notMatching: false,
    });
  }
//====================================================
  render() {
    return (
      <div>
        <p>Sign up for CookBook:</p>
        <TextField
          style={{ height: 40, width: 250 }}
          placeholder='Name'
          inputStyle={styles.textField}
          onChange={this.updateName.bind(this)}
        />
        {this.state.noEmail ? 
        <p>Please enter a valid email address.</p>
        : (null)}
        <TextField
          style={{ height: 40, width: 250 }}
          placeholder='Email'
          inputStyle={styles.textField}
          onChange={this.updateEmail.bind(this)}
        />
        {this.state.tooShort ? 
        <p>Password must be at least 6 characters.</p>
        : (null)}
        <TextField
          style={{ height: 40, width: 250 }}
          placeholder='Password'
          type='password'
          inputStyle={styles.textField}
          onChange={this.updatePassword.bind(this)}
        />
        {this.state.notMatching ? 
        <p>Passwords do not match.</p>
        : (null)}
        <TextField
          style={{ height: 40, width: 250 }}
          placeholder='Confirm Password'
          type='password'
          inputStyle={styles.textField}
          onChange={this.updateConfirmedPassword.bind(this)}
        />
        <Button
          onClick={this.submitSignup.bind(this)}
          variant='contained' 
          color='primary'
          size='small'
        > 
        Sign Up 
        </Button>
        <p>Already have an account?</p>
        <Button
          onClick={() => {
            // this.props.screenProps.switchToLogin();
          }}
          variant='contained' 
          color='secondary'
          size='small'
        > 
        Go Back 
        </Button>
      </div>
    )
  }
}
const styles = {
    textField: {
    fontSize: 10, 
 }
}
//==================================================== 

export default Signup;