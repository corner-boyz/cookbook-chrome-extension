/* global chrome */

import React from 'react';

import { Grid, TextField, Menu, MenuItem, IconButton } from '@material-ui/core';
import { Delete }from '@material-ui/icons';
import styles from '../../styles';

import IP from '../../../IP';
import axios from 'axios';

//==================================================== 
class InputListEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      quantity: null,
      unit: null,
      ingredient: '',
      unparsed: '',
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

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleKeyDown = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      this.props.submitUnparsed();
    }
  }

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

  handleUnparsed = (e) => {
    let code = e.keyCode || e.which;
    if (code == 13) { 
      this.props.submitUnparsed();
    } else {
      this.setState({
        unparsed: e.target.value,
      });
      this.props.handleUnparsed(e.target.value);
    }
  }

  //====================================================
  render() {
    const { anchorEl } = this.state;
    if (this.props.type === 'empty') {
      return (<TextField
              disableUnderline={true}
              color='primary'
              value={this.state.unparsed}
              style={{ height: 40, width: '100%' }}
              placeholder='Ex: "2 pound salmon"'
              onChange={(e) => this.handleUnparsed(e)}
              onKeyDown={this.handleKeyDown}
              inputProps={{style: styles.boxTextField}}
            />);
    } else {
      return (
      <div style={styles.container}>
      <Grid container>
      {(this.props.type === 'given' || this.props.type === 'editing') ? 
        (<Grid item xs={2}>
          <br></br>
            <Delete 
            style={{ height: 20, width: 20 }}
            color='active'
            onClick={() => this.handleQuantity(0, this.props.index)}/>
          <br></br>
        </Grid>)
        :(null)
      }
        <Grid item xs={this.props.type === 'empty' ? 12 : 10}>
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
        {this.props.type === 'given' ?
        (<span style={styles.textField}>{this.state.ingredient}</span>)
        :(<TextField
          value={this.state.ingredient}
          style={{ height: 40, width: '60%' }}
          placeholder='Ingredient'
          onChange={(e) => this.handleIngredient(e.target.value, this.props.index)}
          inputProps={{style: styles.textField}}
        />)} 
          </Grid>
        </Grid>
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
          }}>
          {Object.keys(this.units).map(option => (
            <MenuItem onClick={() => this.handleUnit(this.units[option], this.props.index)}>
            {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )}
  }
}

export default InputListEntry;