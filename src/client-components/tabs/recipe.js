/* global chrome */

import React from 'react';

import { Button, List, ListItemText, Typography } from '@material-ui/core';
import InputList from './sub-components/inputList';
import styles from '../styles';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class Recipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
      selected: [],
      comparisons: [],
      comparisonStyles: [],
      editing: false,
    }

    this.compare = this.compare.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getSelected();
    this.getIngredients();
  }

  compare() {
    axios.post(`http://${IP}/api/compare`, {
          recipe: this.state.selected,
          ingredients: this.state.ingredients,
        }).then(results => {
          console.log('COMPARISON RESULTS', results.data);
          let comparisonArr = [];
          results.data.forEach((comparison, index) => {
            if (comparison.quantity > 0) {
              this.state.comparisonStyles[index] = {
                color: '#78AB46'
              }
            } else {
              comparison.quantity *= -1;
              comparisonArr.push(comparison);
              this.state.comparisonStyles[index] = {
                color: 'red'
              }
            }
          });
          this.setState({
            comparisons: comparisonArr,
          });
        }).catch(error => {
          console.log('Error in comparing selection:', error);
        });
  }

  getIngredients() {
    axios.get(`http://${IP}/api/ingredients/${this.props.email}`) 
      .then(results => {
        this.setState({
          ingredients: results.data,
        });
      }).then(this.compare)
      .catch(error => {
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

  submitIngredient() {
  }

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    });
  }
  //====================================================
  render() {
    let selectedScreen = this.state.editing ? 
      (<div style={styles.container}>
        <List style={{ textAlign: 'center' }}>
          <ListItemText primary='Ingredients Needed:' style={{ width: '80%', margin: 'auto' }}/> 
          <InputList number={this.state.comparisons.length} 
                     type='editing' 
                     email={this.props.email}
                     given={this.state.comparisons} 
                     toggleEditing={this.toggleEditing}/>
        </List>
      </div>)
      :(<div style={styles.container}>
        <List style={{ textAlign: 'center' }}>
            <ListItemText primary='Selected Ingredients:'style={{ width: '80%', margin: 'auto' }}/> 
            {this.state.selected.map((obj, index) => {
              return (<Typography variant="body1" color="inherit">
                  <span style={this.state.comparisonStyles[index]}>
                    {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                  </span>
                </Typography>)
            })}
        </List>
        <div style={{ textAlign: 'center' }}>
          <Button
            variant='contained' 
            color='primary'
            size='small'
            onClick={this.toggleEditing}
          >
          See Difference
          </Button>
        </div>
      </div>);
    return selectedScreen;
  }
}

export default Recipe;