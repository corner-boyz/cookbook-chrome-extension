/* global chrome */

import React, { Component } from 'react';
import Login from './client-components/login';
import Signup from './client-components/signup';
import Main from './client-components/main';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      screen: 'login',
    }
    this.changeScreen = this.changeScreen.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
  }
  
  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate() {
    this.checkLogin();
  }
  
  changeScreen(screen){
    this.setState({
      screen: screen,
    })
  }
  
  checkLogin() {
    chrome.storage.sync.get(['isLoggedIn'], result => {
      this.setState({
        isLoggedIn: result.isLoggedIn,
      });
    });
  }


  render() {
    let loginScreen = <Login changeScreen={this.changeScreen}/>;
    let mainScreen = <Main changeScreen={this.changeScreen}/>;
    if (this.state.isLoggedIn && this.state.screen === 'login') {
      return mainScreen;
    } else if (!this.state.isLoggedIn && this.state.screen === 'ingredients') {
      return loginScreen;
    } else {
      switch(this.state.screen) {
        case 'login': return loginScreen;
        case 'signup': return <Signup changeScreen={this.changeScreen}/>;
        case 'ingredients': return mainScreen;
        default: return loginScreen;
      }
    }
  }
}

export default App;
