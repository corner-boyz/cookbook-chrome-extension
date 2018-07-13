/* global chrome */

import React from 'react';
import App from './App';
import Recipe from './client-components/tabs/recipe';
import { ClipLoader } from 'react-spinners';

import { MuiThemeProvider } from '@material-ui/core/styles';
import Themes from './theme';

class PopupOrModal extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isLoading: true,
      isModal: false,
      theme: Themes.PantryTheme,
    };
    
    this.changeTheme = this.changeTheme.bind(this);
  }

  componentDidMount() {
    chrome.storage.sync.get(['cbIsModal'], result => {
      if (result.cbIsModal) {
        chrome.storage.sync.set({
          'cbIsModal': false
        });
        this.setState({
          isModal: true,
        });
      } 
      this.setState({
        isLoading: false,
      });
    });
    // If this does not work, it should still load after 3 seconds
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 3000);
  }

  changeTheme(theme) {
    if (theme === 0) {
      this.setState({
        theme: Themes.ListTheme,
      });
    } else if (theme === 1) {
      this.setState({
        theme: Themes.PantryTheme,
      });
    } else {
      this.setState({
        theme: Themes.RecipesTheme,
      });
    }
  }
  

  
  render() {
    if (this.state.isLoading) {
      return  <div style={{ width: "20%", margin: "auto" }}>
              <div style={{ position: "absolute", top: "50%" }}>
               <ClipLoader
                color={'orange'} 
                loading={this.state.isLoading} 
              /></div></div>
    } else {
      if (this.state.isModal) {
        return <MuiThemeProvider theme={Themes.PantryTheme}><Recipe/></MuiThemeProvider>;
      } else {
        return <MuiThemeProvider theme={this.state.theme}>
                <App changeTheme={this.changeTheme}/>
              </MuiThemeProvider>;
      }
    }
  }
}

export default PopupOrModal;
