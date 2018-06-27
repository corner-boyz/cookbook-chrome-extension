import React, { Component } from 'react';
import Home from './client-components/home';
import Login from './client-components/login';
import Signup from './client-components/signup';

class App extends Component {
  render() {
    return (
      <Login />
      // <div className="App">
      //   <header className="App-header">
      //     <h1 className="App-title">Welcome to CookBook</h1>
      //   </header>
      //   <p className="App-intro">
      //     Welcome to your CookBook account.
      //   </p>
      // </div>
    );
  }
}

export default App;
