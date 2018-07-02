/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ListWrapper from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import styles from './styles';

import Recipe from './tabs/recipe';
import Ingredients from './tabs/ingredients';
import List from './tabs/list';

import IP from '../IP';
import axios from 'axios';
import { Toolbar, Typography } from '@material-ui/core';

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
    }
    console.log('STYLES', styles);
    this.tabStyles = [styles.defaultTab, styles.defaultTab, styles.defaultTab];

    this.changeScreen = this.changeScreen.bind(this);
    this.getSelected = this.getSelected.bind(this);
    this.getIngredients = this.getIngredients.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateTabs = this.updateTabs.bind(this);
  }
  //====================================================
  componentDidMount() {
    //this.getIngredients();
    //this.getSelected();
    chrome.storage.sync.get(['email'], result => {
      this.setState({
        email: result.email
      });
    });
  }

  componentDidUpdate() {
    this.updateTabs();
  }

  changeScreen(screen) {
    this.setState({
        screen: screen,
    });
  }

  compare() {

  }
  
  getIngredients() {
    axios.get(`http://${IP}/api/ingredients/a@a.com`) 
    .then(results => {
      this.setState({
        ingredients: results.data,
      });
    }).catch(error => {
      console.log('Error in retrieving ingredients:', error);
    });
  }
  
  getSelected() {
    chrome.storage.sync.get(['selected'], result => {
      if (result.selected.ingredients) {
        axios.post(`http://${IP}/api/parse`, {
          ingredients: result.selected.ingredients,
        }).then(results => {
          this.setState({
            selected: results.data,
          });
        }).catch(error => {
          console.log('Error in parsing selection:', error);
        });
      }
    });
  }

  logOut() {
    chrome.storage.sync.set({
      'isLoggedIn': false,
      'email': null,
      'name': null
    });
    this.props.changeScreen('login');
  }

  updateData() {
    this.getIngredients();
    //this.getSelected();
  }

  updateTabs() {
    this.tabStyles.forEach((tab, index) => {
        if (index === this.state.screen) {
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
            case 0: return <Recipe ingredients={this.state.ingredients} list={this.state.list} update={this.updateData}/>;
            case 1: return <Ingredients ingredients={this.state.ingredients} list={this.state.list} selected={this.state.selected} update={this.updateData}/>;
            case 2: return <List ingredients={this.state.ingredients} list={this.state.list} selected={this.state.selected} update={this.updateData}/>;
            default: return <Recipe ingredients={this.state.ingredients} list={this.state.list} update={this.updateData}/>;
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