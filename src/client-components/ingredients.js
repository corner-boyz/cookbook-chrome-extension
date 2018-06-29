/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import IP from '../IP';
import axios from 'axios';

//==================================================== 'index' state is required for refreshing the ingredient's list;
class Ingredients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      ingredients: [],
    }

    this.getIngredients = this.getIngredients.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getIngredients();
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

  logOut() {
    chrome.storage.sync.set({
      'isLoggedIn': false,
      'email': null,
      'name': null
    });
    this.props.changeScreen('login');
  }

  submitIngredient() {
    let newIngredient = {
      name: this.props.screenProps.text,
      quantity: 99
    };
    this.props.screenProps.ingredients.push(newIngredient)
    this.setState({
      index: this.state.index + 1
    })
  }
  //====================================================
  render() {
    return (
      <div style={styles.container}>
        <p>Here are your Ingredients:</p>
        <ul>
        {this.state.ingredients.map(ingredient => {
          return <li>{ingredient.ingredient}</li>;
        })}
        </ul>
        <TextField
          style={{ height: 40, width: 250 }}
          placeholder='Add an Ingredient'
          onChange={(text) => this.props.screenProps.text = text}
          inputProps={{style: styles.textField}}
        />
        <Button
          variant='contained' 
          color='primary'
          size='small'
          onClick={this.submitIngredient}
        >
        Submit
        </Button>
        <Button
          variant='contained' 
          color='secondary'
          size='small'
          onClick={this.logOut}
        >
        Log Out
        </Button>
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
};

export default Ingredients;