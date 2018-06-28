import React, { Component } from 'react';
import Home from './client-components/home';
import Login from './client-components/login';
import Signup from './client-components/signup';
import Ingredients from './client-components/ingredients';

import IP from './IP';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: 'login',
    }
    this.changeScreen = this.changeScreen.bind(this);
  }

  componentDidMount() {
    axios.get(`http://${IP}/api/checkLogin`).then(results => {
      const { isLoggedIn, email, name } = results.data;
      if (isLoggedIn) {
        this.setState({
          screen: 'ingredients',
        });
      } 
    }).catch(error => {
      console.log('Error in checking user login:', error);
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
  //   return (
  //     // <div className="App">
  //     //   <header className="App-header">
  //     //     <h1 className="App-title">Welcome to CookBook</h1>
  //     //   </header>
  //     //   <p className="App-intro">
  //     //     Welcome to your CookBook account.
  //     //   </p>
  //     // </div>
  //   );
  }
}

export default App;
