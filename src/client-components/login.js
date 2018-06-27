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
  // //==================================================== NavBar component
  //   static navigationOptions = {
  //     tabBarColor: 'green',
  //     tabBarIcon: () => {
  //       return <Ionicons name='ios-basket' size={25} color='white' />;
  //     },
  //   }
  //====================================================
  componentDidMount() {
  }
  //====================================================
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
          // Do something with this data
          this.props.screenProps.logIn();
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
          />
        {this.state.wrongEmailOrPass
          ? (<p>Wrong email or password.</p>)
          : (null)}
        <TextField
          style={{ height: 40, width: 250 }}
          type='password'
          placeholder='Password'
          secureTextEntry={true}
          onChange={this.updatePassword.bind(this)}
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
        {/* <Button
          title="Sign Up"
          onPress={() => {
            this.props.screenProps.switchToSignUp();
          }}
          color='#ff0000'
        /> */}
        <Button 
          variant='contained' 
          color='secondary'
          size='small'>
        Sign Up
        </Button>
      </div>
    )
  }
}
//==================================================== 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   list: {
//     width: 350,
//     backgroundColor: 'white'
//     // justifyContent: 'center',
//   },
//   signUpText: {
//     paddingTop: 20,
//     paddingBottom: 10,
//   },
//   signUpButton: {
//     backgroundColor: '#ff0000',
//   },
//   warningText: {
//     color: '#ff0000'
//   }
// });

export default Login;