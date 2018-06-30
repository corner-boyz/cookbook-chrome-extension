/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ListWrapper from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import Recipe from './subcomponents/recipe';
import Ingredients from './subcomponents/ingredients';
import List from './subcomponents/list';

import IP from '../IP';
import axios from 'axios';

//==================================================== 
class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
      list: [],
      selected: [],
      screen: 0,
    }

    this.tabStyles = [styles.defaultTab, styles.defaultTab, styles.defaultTab];

    this.changeScreen = this.changeScreen.bind(this);
    this.getSelected = this.getSelected.bind(this);
    this.getIngredients = this.getIngredients.bind(this);
    this.updateData = this.updateData.bind(this);
    this.updateTabs = this.updateTabs.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getIngredients();
    this.getSelected();
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
//==================================================== 
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: 350,
    backgroundColor: 'white'
    // justifyContent: 'center',
  },
  textField:{
    fontSize: 12
  },
  defaultTab: {
    width: 20,
    height: 5,
  },
  activeTab: {
    width: 20,
    height: 5,
    color: '#ffffe6',
    borderBottom: '5px solid #ffffe6',
  }
};

export default Main;