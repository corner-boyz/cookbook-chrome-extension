/* global chrome */

import React from 'react';

import { AppBar, IconButton, Menu, MenuItem, Paper, Tab, Tabs } from '@material-ui/core';
import { AccountCircle, LocalMall, LocalDining, ShoppingCart } from '@material-ui/icons';
import styles from './styles';

import SavedRecipes from './tabs/savedRecipes';
import Ingredients from './tabs/ingredients';
import List from './tabs/list';

//==================================================== 
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email:'',
      ingredients: [],
      list: [],
      selected: [],
      screen: 1,
      anchorEl: null,
    };

    this.tabStyles = [styles.defaultTab, styles.defaultTab, styles.defaultTab];

    this.changeScreen = this.changeScreen.bind(this);
    this.logOut = this.logOut.bind(this);
    this.updateTabs = this.updateTabs.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.props.checkLogin();
    this.updateTabs(this.state.screen);
  }

  changeScreen(screen) {
    this.setState({
        screen: screen,
    });
    this.updateTabs(screen);
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  logOut() {
    chrome.storage.sync.set({
      'cbLogin': {
        'isLoggedIn': false,
        'email': null,
        'name': null
      }
    });
    this.props.checkLogin();
    this.props.changeScreen('login');
    this.props.changeTheme(1);
  }

  updateTabs(screen) {
    this.props.changeTheme(screen);
    this.tabStyles.forEach((tab, index) => {
        if (index === screen) {
            this.tabStyles[index] = styles.activeTab;
        } else {
            this.tabStyles[index] = styles.defaultTab;
        }
    });
  }
  //====================================================
  render() {
    let currentScreen = (() => {
        switch(this.state.screen) {
            case 0: return <List email={this.props.email} name={this.props.name}/>;
            case 1: return <Ingredients email={this.props.email} name={this.props.name}/>;
            case 2: return <SavedRecipes email={this.props.email} name={this.props.name}/>;
            default: return <Ingredients email={this.props.email} name={this.props.name}/>;
        }
    })();
    const { anchorEl } = this.state;
    return (
      <div style={styles.main}>
      <AppBar position="static">
          <div align="right" style={{ height: 30, marginTop: 5, marginRight: 10, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0px', left: '171px', zIndex: 2 }}>
                <IconButton
                  style={styles.textField}
                  aria-label="More"
                  aria-owns={anchorEl ? 'long-menu' : null}
                  aria-haspopup="true"
                  onClick={this.handleClick}
                  inputProps={{style: styles.textField}}
                >
                <AccountCircle color={"secondary"}/>
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                  inputProps={{style: styles.textField}}
                  PaperProps={{
                    style: {
                      width: 170,
                    },
                  }}>
                    <MenuItem inputProps={{style: styles.textField}} onClick={this.logOut}>
                    Log out&nbsp;<strong>{this.props.name}</strong>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
              <img src="./chefHat.png" height="16" width="16" style={{ backgroundColor: 'transparent',  position: 'absolute', top: '5.5px', left: '187.5px', zIndex: 3, opacity: 0.8 }}></img>
          </div>
          <Tabs>
            <Tab style={this.tabStyles[0]} label="List" icon={<ShoppingCart/>} onClick={() => this.changeScreen(0)}/>
            <Tab style={this.tabStyles[1]} label="Pantry" icon={<LocalMall/>} onClick={() => this.changeScreen(1)}/>
            <Tab style={this.tabStyles[2]} label="Recipes" icon={<LocalDining/>} onClick={() => this.changeScreen(2)}/>
          </Tabs>
      </AppBar>
      {currentScreen}
      </div>
    )
  }
}
      
export default Main;