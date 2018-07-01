/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import { Menu, MenuItem, IconButton } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import styles from '../../styles';

import IP from '../../../IP';
import axios from 'axios';

//==================================================== 
class InputListEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      quantity: 0,
      unit: null,
      ingredient: '',
    }

    this.units = {
      '(none)': ' ',
      teaspoon: 'tsp',
      tablespoon: 'Tbs',
      'fluid ounce': 'fl-oz',
      cup: 'cup',
      pint: 'pnt',
      quart: 'qt',
      gallon: 'gal',
      ounce: 'oz',
      pound: 'lb',
      liter: 'l',
    };
  }
  //====================================================
  componentDidMount() {
    if (this.props.type !== 'empty') {
      let unit = this.props.given.unit;
      if (!unit) unit = ' ';
      this.setState({
        quantity: this.props.given.quantity,
        unit: unit,
        ingredient: this.props.given.ingredient,
      });
    }
  }

  compare() {

  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleQuantity = (value, index) => {
    this.setState({
      quantity: value, 
    });
    this.props.handleQuantity(value, index);
  };

  handleUnit = (value, index) => {
    this.setState({
      unit: value, 
    });
    this.props.handleUnit(value, index);
    this.handleClose();
  };

  handleIngredient = (value, index) => {
    this.setState({
      ingredient: value, 
    });
    this.props.handleIngredient(value, index);
  };

  submitIngredient() {
    let unit = this.state.unit === ' ' ? null : this.state.unit;
    let newIngredient = {
      quantity: this.state.quantity,
      unit: unit,
      ingredient: this.state.ingredient,
    };
    
    this.props.update();
  }
  //====================================================
  render() {
    const { anchorEl } = this.state;
    return (
      <div style={styles.container}>
        <TextField
          value={this.state.quantity}
          style={{ height: 40, width: '15%' }}
          placeholder='Qt'
          onChange={(e) => this.handleQuantity(e.target.value, this.props.index)}
          inputProps={{style: styles.textField}}
        />
        <IconButton
          style={styles.textField}
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
          inputProps={{style: styles.textField}}
        >
         <TextField
          value={this.state.unit}
          onChange={this.handleClick}
          placeholder='Unit'
          inputProps={{style: styles.textField}}
        />
        </IconButton>
        <TextField
          value={this.state.ingredient}
          style={{ height: 40, width: '60%' }}
          placeholder='Ingredient'
          onChange={(e) => this.handleIngredient(e.target.value, this.props.index)}
          inputProps={{style: styles.textField}}
        />
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          inputProps={{style: styles.textField}}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: 200,
            },
          }}
        >
          {Object.keys(this.units).map(option => (
            <MenuItem onClick={() => this.handleUnit(this.units[option], this.props.index)}>
            {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default InputListEntry;