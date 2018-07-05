/* global chrome */

import React from 'react';

import { Button, List, ListItemText, Typography } from '@material-ui/core';
import InputList from './sub-components/inputList';
import styles from '../styles';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class SavedRecipes extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      recipes: [],
    };

    this.getRecipes= this.getRecipes.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getRecipes();
  }

  getRecipes() {
    axios.get(`http://${IP}/api/userRecipes/calvinchui382025@yahoo.com`) 
      .then(results => {
        console.log('RECIPES', results);
        this.setState({
          recipes: results.data,
        });
      }).then(this.compare)
      .catch(error => {
        console.log('Error in retrieving ingredients:', error);
      });
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    })
  }

  //====================================================
  render() {
      return (
    <div style={styles.container}>
        <List>
          <ListItemText primary='My Recipes:' style={{ width: '70%', margin: 'auto' }}/> 
          <div style={{ height: 200, maxHeight: 200, overflow: 'auto'}}>
            <div style={{ width: '80%', margin: 'auto' }}>
              {this.state.recipes.map(recipe => {
                return (<p><img src={recipe.imageurl} height="42" width="42"/><a href={recipe.sourceurl}>{recipe.title}</a></p>);
              })}
            </div>
          </div>       
        </List>
      </div>);
  }
}

export default SavedRecipes;