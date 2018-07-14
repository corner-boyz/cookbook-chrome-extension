/* global chrome */

import React from 'react';

import { Button } from '@material-ui/core';
import { ClipLoader } from 'react-spinners';
import InputListEntry from './inputListEntry';

import IP from '../../../IP';
import axios from 'axios';

//==================================================== 
class IngredientList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      unparsed: '',
      style: {},
      secondaryStyle: {},
    }

    this.createEntries = this.createEntries.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleUnit = this.handleUnit.bind(this);
    this.handleIngredient = this.handleIngredient.bind(this);
    this.handleUnparsed = this.handleUnparsed.bind(this);
    this.resetEntries = this.resetEntries.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);
    this.submitUnparsed = this.submitUnparsed.bind(this);

  }
  //====================================================
  componentDidMount() {
    this.createEntries();
    this.setStyle();
  }

  createEntries() {
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

  createObj() {
    let obj = { quantity: null, unit: null, ingredient: '' };
    return obj;
  }

  handleQuantity = (value, index) => {
    if (value === ' ') {
      value = null;
    }
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

  handleUnparsed = (value) => {
    this.setState({
      unparsed: value,
    });
  };

  resetEntries() {
    this.setState({
      entries: [],
    });
    setTimeout(() => {
      if (!this.state.entries.length) {
        this.createEntries();
      }
    }, 3000);
  }

  setStyle() {
    switch(this.props.type) {
      case 'editing': this.setState({
        style: { height: 200, maxHeight: 200, overflow: 'auto' }
      }); 
        break;
      case 'given': this.setState({
        style: { height: 200, maxHeight: 200, overflow: 'auto' },
        secondaryStyle: { width: '80%', margin: 'auto' }
      });
        break;
      default: //do nothing
    }
  }

  submitIngredients() {
    let entries = this.state.entries.slice();
    if (this.props.endpoint !== 'ingredients') {
      entries.forEach(entry => {
        entry.ispurchased = false;
      });
    }
    axios.post(`http://${IP}/api/${this.props.endpoint || 'ingredients'}`, {
      ingredients: entries,
      email: this.props.email,
      shouldReplace: this.props.type !== 'empty',
    }).then(() => {
      this.props.getIngredients();
      if (!this.state.entries.length) {
        this.createEntries();
      }
    }).catch((err) => {
      if (err.request._hasError || err.response.request.status === 404) {
        console.log('ERROR purchasing ingredients', err);
        alert('Trouble connecting to server. Please try again later.');
      }
      else if (err.response) {
        console.log('ERROR converting units', err.response.request.response);
        alert('Invalid unit conversion: ' + err.response.request.response);
      }
    });
  }

  submitUnparsed() {
    this.resetEntries();
    axios.post(`http://${IP}/api/parse`, {
      ingredients: [ this.state.unparsed ],
    }).then((results) => {
      let parsed = results.data.slice();
      if (this.props.endpoint === 'grocerylist') {
        parsed.forEach(ingredient => {
          ingredient.ispurchased = false
        });
      }
      axios.post(`http://${IP}/api/${this.props.endpoint || 'ingredients'}`, {
        ingredients: parsed,
        email: this.props.email,
        shouldReplace: false,
      }).then(() => {
        this.props.getIngredients();
        if (!this.state.entries.length) {
          this.createEntries();
        }
      }).catch((err) => {
        if (err.request._hasError || err.response.request.status === 404) {
          console.log('ERROR purchasing ingredients', err);
          alert('Trouble connecting to server. Please try again later.');
        }
        else if (err.response) {
          console.log('ERROR converting units', err.response.request.response);
          alert('Invalid unit conversion: ' + err.response.request.response);
        }
      });
    }).catch((err) => {
      console.log('ERROR parsing text', err);
    });
  }
  //====================================================
  render() {
    let button = (() => {
      switch (this.props.type) {
        case 'editing': return <Button
                                  id=''
                                  variant='contained' 
                                  color='primary'
                                  size='small'
                                  onClick={() => {
                                    this.props.submitList(this.state.entries);
                                    this.props.toggleEditing();
                                    this.props.toggleSaving();
                                  }}>
                                Add to List
                                </Button>
        case 'given': return <Button
                          variant='contained' 
                          color='primary'
                          size='small'
                          onClick={() => {
                            this.props.saveScreen();
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
                            this.submitUnparsed();
                          }}>
                          Add
                        </Button>
      }
    })();
    return (
      <div>
        <div style={this.state.style}>
        <div> 
        {this.state.entries.length ? (null) : 
        <div style={{ height: 50, textAlign: 'center' }}>
          <ClipLoader color={'orange'} />
        </div>}
        {this.state.entries.map((entry, index) => {
          if (entry.quantity !== 0 || this.props.type === 'empty') {
            return (<span><InputListEntry
            handleQuantity={this.handleQuantity}
            handleUnit={this.handleUnit}
            handleIngredient={this.handleIngredient}
            handleUnparsed={this.handleUnparsed}
            submitUnparsed={this.submitUnparsed}
            index={index}
            type={this.props.type}
            given={entry}
            style={this.state.secondaryStyle}
          /></span>);
          } else {
            return (null);
          }
        })}
        </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 5, marginBottom: 5 }}>
          {button}
        </div>
      </div>
    )
  }
}

export default IngredientList;