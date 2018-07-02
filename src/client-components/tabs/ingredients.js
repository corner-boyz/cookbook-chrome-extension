/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import { Menu, MenuItem, IconButton, Input } from '@material-ui/core';
import { Toolbar, Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import styles from '../styles';

import IP from '../../IP';
import axios from 'axios';
import InputList from './sub-components/inputList';

//==================================================== 
class Ingredients extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ingredients: [],
      editing: false,
    };

    this.getIngredients = this.getIngredients.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getIngredients();
    this.props.update();
  }

  compare() {

  }

  getIngredients() {
    axios.get(`http://${IP}/api/ingredients/c@$.com`) 
      .then(results => {
        this.setState({
          ingredients: results.data,
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
    let ingredientsScreen = this.state.editing ?
      <InputList number={this.state.ingredients.length} 
                 type='given' 
                 given={this.state.ingredients} 
                 toggleEditing={this.toggleEditing}/>
      : (<div style={styles.container}>
        <List style={styles.list}>
          <ListItemText primary='My Ingredients:' style={{ width: '70%', margin: 'auto' }}/> 
          <div style={{ width: '90%', margin: 'auto' }}>
            {this.state.ingredients.map(obj => {
              return (<Typography variant="body1" color="inherit">
              {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
              </Typography>);
            })}
          </div>       
        </List>
        <div style={{ textAlign: 'center' }}>
          <Button
            variant='contained' 
            color='primary'
            size='small'
            onClick={this.toggleEditing}>
            Edit
          </Button> 
        </div>
        <InputList number={1} 
                   type='empty'
                   toggleEditing={this.toggleEditing}/>
      </div>);
    return ingredientsScreen;
  }
}

export default Ingredients;