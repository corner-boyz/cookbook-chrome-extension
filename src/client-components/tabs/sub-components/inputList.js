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
      style: {},
      secondaryStyle: {},
    }

    this.createEntries = this.createEntries.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleUnit = this.handleUnit.bind(this);
    this.handleIngredient = this.handleIngredient.bind(this);
    this.resetEntries = this.resetEntries.bind(this);
    this.setStyle = this.setStyle.bind(this);
    this.submitIngredients = this.submitIngredients.bind(this);

  }
  //====================================================
  componentDidMount() {
    this.createEntries();
    this.setStyle();
  }

  closeModal() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {type: "closeModal"});
     });
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

  resetEntries() {
    this.setState({
      entries: [],
    });
  }

  setStyle() {
    switch(this.props.type) {
      case 'editing': this.setState({
        style: { height: 200, maxHeight: 200, overflow: 'auto' }
      }); 
      case 'given': this.setState({
        style: { height: 200, maxHeight: 200, overflow: 'auto' },
        secondaryStyle: { width: '80%', margin: 'auto' }
      });
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
    }).catch((error) => {
      console.log('Error in posting ingredient', error);
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
                            this.submitIngredients();
                            this.resetEntries();
                          }}>
                          Add
                        </Button>
      }
    })();
    return (
      <div>
        <div style={this.state.style}>
        <div> 
        {this.state.entries.length ? (null) : <p>Adding...</p>}
        {this.state.entries.map((entry, index) => {
          if (entry.quantity > 0 || this.props.type === 'empty') {
            return (<span><InputListEntry
            handleQuantity={this.handleQuantity}
            handleUnit={this.handleUnit}
            handleIngredient={this.handleIngredient}
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