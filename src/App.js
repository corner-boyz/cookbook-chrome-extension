/* global chrome */

import React from 'react';
import Login from './client-components/login';
import Signup from './client-components/signup';
import Main from './client-components/main';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      screen: 'login',
      email: '',
      name: '',
    }
    this.changeScreen = this.changeScreen.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setName = this.setName.bind(this);
  }
  
  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate() {
   // this.checkLogin();
  }
  
  changeScreen(screen){
    this.setState({
      screen: screen,
    });
  }
  
  checkLogin() {
    chrome.storage.sync.get(['login'], result => {
      const { isLoggedIn, email, name } = result.login;
      this.setState({
        isLoggedIn: isLoggedIn,
        email: email,
        name: name,
      });
    });
  }

  setEmail(email) {
    this.setState({
      email: email,
    });
  }

  setName(name) {
    this.setState({
      name: name,
    });
  }


  render() {
    let loginScreen = <Login changeScreen={this.changeScreen} checkLogin={this.checkLogin}/>;
    let mainScreen = <Main changeScreen={this.changeScreen} checkLogin={this.checkLogin} name={this.state.name} email={this.state.email}/>;
    if (this.state.isLoggedIn && this.state.screen === 'login') {
      return mainScreen;
    } else if (!this.state.isLoggedIn && this.state.screen === 'main') {
      return loginScreen;
    } else {
      switch(this.state.screen) {
        case 'login': return loginScreen;
        case 'signup': return <Signup changeScreen={this.changeScreen}/>;
        case 'main': return mainScreen;
        default: return loginScreen;
      }
    }
  }
}

export default App;
