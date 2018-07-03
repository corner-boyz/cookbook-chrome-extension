/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import InputListEntry from './inputListEntry';
import styles from '../../styles';

import IP from '../../../IP';
import axios from 'axios';

//==================================================== 
class IngredientList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
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
    });
  }

  compare() {

  }

  createObj() {
    let obj = { quantity: null, unit: null, ingredient: '' };
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
    let newEntries = this.state.entries.slice();
    newEntries[index].unit = value;
    this.setState({
      entries: newEntries,
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
    axios.post(`http://${IP}/api/ingredients`, {
      ingredients: entries,
      email: 'c@$.com',
      shouldReplace: this.state.entries.length > 1
    }).then(() => {
      this.props.getIngredients();
    }).catch((error) => {
      console.log('Error in posting ingredient', error);
    });
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