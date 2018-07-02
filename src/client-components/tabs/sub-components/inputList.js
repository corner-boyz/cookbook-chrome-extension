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
import InputListEntry from './inputListEntry';

//==================================================== 
class IngredientList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      quantities: [],
      units: [],
      ingredients: [],
      type: '',
    }

    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleUnit = this.handleUnit.bind(this);
    this.handleIngredient = this.handleIngredient.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);

  }
  //====================================================
  componentDidMount() {
    let objects = [];
    for (let i = 0; i < this.props.number; i++) {
      let obj = this.createObj();
      if (this.props.type !== 'empty') {
        obj = this.props.given[i]
      } 
      objects.push(obj);
    }
    this.setState({
      entries: objects,
      quantities: objects.map(obj => obj.quantity),
      units: objects.map(obj => obj.unit),
      ingredients: objects.map(obj => obj.ingredient),
    });
  }

  compare() {

  }

  createObj() {
    let obj = { quantity: 0, unit: null, ingredient: '' };
    return obj;
  }

  handleQuantity = (value, index) => {
    let newEntries = this.state.entries.slice();
    newEntries[index].quantity = value;
    this.setState({
      entries: newEntries,
    });
  };

  handleUnit = (value, index) => {
    let newUnits = this.state.units.slice();
    newUnits[index] = value;
    this.setState({
      units: newUnits,
    });
  };

  handleIngredient = (value, index) => {
    let newEntries = this.state.entries.slice();
    newEntries[index].ingredient = value;
    this.setState({
      entries: newEntries,
    });
  };

  submitIngredients() {
    let entries = this.state.entries.slice();
    entries.forEach((entry, index) => {
      entry.quantity = this.state.quantities[index];
      entry.unit = this.state.units[index];
      entry.ingredient = this.state.ingredients[index];
    });
    console.log(entries);
  }
  //====================================================
  render() {
    let button = (() => {
      switch (this.props.type) {
        case 'editing': return <Button
                                  variant='contained' 
                                  color='primary'
                                  size='small'
                                  onClick={() => {
                                    this.props.toggleEditing();
                                    this.submitIngredients();
                                  }}>
                                Add to List
                                </Button>
        case 'given': return <Button
                          variant='contained' 
                          color='primary'
                          size='small'
                          onClick={() => {
                            this.props.toggleEditing();
                            this.submitIngredients();
                          }}>
                        Save
                        </Button>
        default: return <Button
                          variant='contained' 
                          color='primary'
                          size='small'
                          onClick={() => {
                            this.props.toggleEditing();
                            this.submitIngredients();
                          }}>
                          Add
                        </Button>
      }
    })();
    return (
      <div style={styles.container}>
      {this.state.entries.map((entry, index) => {
        return (<InputListEntry
          handleQuantity={this.handleQuantity}
          handleUnit={this.handleUnit}
          handleIngredient={this.handleIngredient}
          index={index}
          type={this.props.type}
          given={entry}
        />);
      })}
        <div style={{ textAlign: 'center' }}>
          {button}
        </div>
      </div>
    )
  }
}

export default IngredientList;