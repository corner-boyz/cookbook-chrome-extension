/* global chrome */

import React, { Component } from 'react';
import Home from './client-components/home';
import Login from './client-components/login';
import Signup from './client-components/signup';
import Ingredients from './client-components/ingredients';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: 'login',
    }
    this.changeScreen = this.changeScreen.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get(['isLoggenIn'], (isLoggedIn) => {
      if (isLoggedIn) {
        this.setState({
          screen: 'ingredients',
        });
      } 
    });
  }

  changeScreen(screen){
    this.setState({
      screen: screen,
    })
  }
  render() {
    switch(this.state.screen) {
      case 'login': return <Login changeScreen={this.changeScreen}/>;
      case 'signup': return <Signup changeScreen={this.changeScreen}/>;
      case 'ingredients': return <Ingredients changeScreen={this.changeScreen}/>;
      default: return <Login changeScreen={this.changeScreen}/>;
    }
  }
}

export default App;
