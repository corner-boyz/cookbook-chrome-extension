/* global chrome */

import React from 'react';

import { AppBar, Tab, Tabs } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import styles from './styles';

import Recipe from './tabs/recipe';
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
      screen: 0,
    };

    this.tabStyles = [styles.defaultTab, styles.defaultTab, styles.defaultTab];

    this.changeScreen = this.changeScreen.bind(this);
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
      'isLoggedIn': false,
      'email': null,
      'name': null
    });
    this.props.changeScreen('login');
  }

  updateTabs(screen) {
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
            case 0: return <Recipe email={this.props.email} name={this.props.name}/>;
            case 1: return <Ingredients email={this.props.email} name={this.props.name}/>;
            case 2: return <List email={this.props.email} name={this.props.name}/>;
            default: return <Recipe email={this.props.email} name={this.props.name}/>;
        }
    })();
    return (
      <div style={styles.container}>
      <AppBar position="static">
          <div align="right" style={{ height: 20, marginTop: 5, marginRight: 10 }}>
                <AccountCircle onClick={this.logOut}/>
          </div>
          <Tabs>
            <Tab style={this.tabStyles[0]} label="Recipe" onClick={() => this.changeScreen(0)}/>
            <Tab style={this.tabStyles[1]} label="Pantry" onClick={() => this.changeScreen(1)}/>
            <Tab style={this.tabStyles[2]} label="List" onClick={() => this.changeScreen(2)}/>
          </Tabs>
      </AppBar>
      {currentScreen}
      </div>
    )
  }
}
      
export default Main;