import React from 'react';

import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { PhoneAndroid } from '@material-ui/icons';
import styles from './styles';

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
    this.submitSignup = this.submitSignup.bind(this);
}

  componentDidMount() {
  }

  redirectToLogin(){
    this.props.changeScreen('login');
  }

  submitSignup() {
    let noEmail = this.state.email.indexOf('@') === -1;
    let notMatching = this.state.password !== this.state.confirmedPassword;
    let tooShort = this.state.password.length < 6;
    this.setState({
        noEmail: noEmail,
        notMatching: notMatching,
        tooShort: tooShort,
    });
    if (!noEmail && !notMatching && !tooShort) {
        axios.post(`http://${IP}/api/signup`, {
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
          })
          .then(() => {
            this.redirectToLogin();
          }).catch(error => {
            alert(`Could not create a new Flex Chef account for the email ${this.state.email}. Please try again.`);
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
      <div style={{ width: 218, backgroundImage: 'url("./4.jpg")', border: '1px solid lightgray', textAlign: 'center' }}>
        <div style={{ marginTop: 10}}>
          <img src="./logo.png" height="120" width="120"></img>
          <Typography variant="body2" color="inherit">
            <span style={{ marginRight: 5 }} onClick={this.redirectToLogin.bind(this)}>Login</span> 
            <span style={{ marginLeft: 5, textDecoration: 'underline' }}>Sign Up</span>
          </Typography>
        </div>
        <Paper style={{ width: '90%', margin: 'auto', borderRadius: '20px', marginTop: 10, marginBottom: 10 }}>
        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
        <TextField
          style={{ height: 40, width: '60%' }}
          placeholder='Name'
          inputProps={{style: styles.textField}}
          onChange={this.updateName.bind(this)}
        />
        {this.state.noEmail ? 
        <p style={styles.warningText}>Invalid email address.</p>
        : (null)}
        <TextField
          style={{ height: 40, width: '60%' }}
          placeholder='Email'
          inputProps={{style: styles.textField}}
          onChange={this.updateEmail.bind(this)}
        />
        {this.state.tooShort ? 
        <p style={styles.warningText}>Password is too short.</p>
        : (null)}
        <TextField
          style={{ height: 40, width: '60%' }}
          placeholder='Password'
          type='password'
          inputProps={{style: styles.textField}}
          onChange={this.updatePassword.bind(this)}
        />
        {this.state.notMatching ? 
        <p style={styles.warningText}>Passwords do not match.</p>
        : (null)}
        <TextField
          style={{ height: 40, width: '60%' }}
          placeholder='Confirm Password'
          type='password'
          inputProps={{style: styles.textField}}
          onChange={this.updateConfirmedPassword.bind(this)}
        />
          <div style={{ textAlign: 'center'}}>
            <Button 
              variant='contained' 
              color='primary'
              size='small'
              onClick={this.submitSignup.bind(this)}>
            Sign Up
            </Button>
          </div>
        </div>
        </Paper>
        <div>
      </div> 
      <Grid container onClick={() => window.open('https://play.google.com/store/apps/details?id=org.chuiohrobinson.flexchef')}>
        <Grid item xs={10} style={{ textAlign: 'right', marginTop: '2px' }}><Typography variant="body1" color="inherit">Check out our mobile app!</Typography></Grid>
        <Grid item xs={2} style={{ textAlign: 'left' }}><PhoneAndroid /></Grid>
      </Grid>
    </div>
    )
  }
}

export default Signup;