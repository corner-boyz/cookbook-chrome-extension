/* global chrome */

import React from 'react';

import { AppBar, Tab, Tabs } from '@material-ui/core';
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
    return (
      <div style={styles.main}>
      <AppBar position="static">
          <div align="right" style={{ height: 20, marginTop: 5, marginRight: 10 }}>
                <AccountCircle onClick={this.logOut} color={"secondary"}/>
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