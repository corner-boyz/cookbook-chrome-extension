import React from 'react';

import Button from '@material-ui/core/Button';
import axios from 'axios';
//==================================================== 
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      wrongEmailOrPass: '', 
    }
    this.submitLogin = this.submitLogin.bind(this);
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
      axios.post(`/api/login`, {
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
  //====================================================
  render() {
    return (
      <div>
        <p>Log in to your CookBook account:</p>
        <input
          style={{ height: 40, width: 250 }}
          placeholder='Email'
          onChangeText={text => this.setState({
            email: text,
            wrongEmailOrPass: false,
          })}
          />
        {this.state.wrongEmailOrPass
          ? <p>Wrong email or password.</p>
          : (null)}
        <input
          style={{ height: 40, width: 250 }}
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={text => this.setState({
            password: text,
            wrongEmailOrPass: false,
          })}
        />
        <Button variant='contained' color='primary'>
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
         <Button variant='contained' color='#ff0000'>
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