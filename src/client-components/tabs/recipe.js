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
      list: [],
      email: '',
      savedNum: 0,
      editing: false,
      isLoading: true,
      isSaving: false,
      saved: false,
      noEmail: false,
    };

    this.compare = this.compare.bind(this);
    this.submitList = this.submitList.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.toggleSaving = this.toggleSaving.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getSelected();
    this.getEmail();
  }

  compare() {
    axios.post(`http://${IP}/api/compareExtension`, {
          recipe: this.state.selected,
          ingredients: this.state.ingredients,
        }).then(results => {
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

  getEmail() {
    chrome.storage.sync.get(['cbLogin'], result => {
      const { email } = result.cbLogin;
      if (!email) {
        this.setState({
          noEmail: true,
        });
      } else {
        this.setState({
          email: email,
        });
        this.getIngredients(email);
        this.getGroceryList(email);
      }
    });
  }

  getGroceryList(email) {
    axios.get(`http://${IP}/api/grocerylist/${email}`) 
      .then(results => {
        this.setState({
          list: results.data,
        });
      }).catch(error => {
        console.log('Error in getting grocery list:', error);
      });
  }

  getIngredients(email) {
    axios.get(`http://${IP}/api/ingredients/${email}`) 
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
    chrome.storage.sync.get(['cbSelected'], result => {
      console.log('SELECTION RESULTS', result);
      if (result.cbSelected.ingredients) {
        axios.post(`http://${IP}/api/parse`, {
          ingredients: result.cbSelected.ingredients,
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

  submitList(entries) {
    let validEntries = entries.filter(entry => entry.quantity > 0);
    this.setState({
      savedNum: validEntries.length,
    });
    axios.post(`http://${IP}/api/combineExtension`, {
      ingredients: entries,
      oldIngredients: this.state.list
    }).then(results => {
        let newList = results.data;
        newList.forEach(ingredient => {
          ingredient.ispurchased = false;
        });
        axios.post(`http://${IP}/api/grocerylist`, {
          ingredients: newList,
          email: this.state.email,
          shouldReplace: true,
        }).then(() => {
          this.setState({
            saved: true
          });
        }).catch((error) => {
          console.log('Error in submitting list', error);
        });
    }).catch((error) => {
      console.log('Error in converting list', error);
    });
}

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    });
  }

  toggleSaving() {
    this.setState({
      isSaving: !this.state.isSaving,
    });
  }

  //====================================================
  render() {
    let selectedScreen = this.state.editing ? 
      (<div style={styles.container}>
        <List style={{ textAlign: 'center' }}>
          <ListItemText primary='Ingredients Needed:' style={{ textAlign: 'center' }}/>
          <InputList number={this.state.comparisons.length} 
                     type='editing' 
                     endpoint='grocerylist'
                     email={this.state.email}
                     given={this.state.comparisons} 
                     submitList={this.submitList}
                     toggleEditing={this.toggleEditing}
                     toggleSaving={this.toggleSaving}/>
        </List>
      </div>)
      :(<div style={styles.container}>
        <List style={{ textAlign: 'center' }}>
            <ListItemText primary='Selected Ingredients:'/> 
            <div style={{ height: 180, maxHeight: 180, overflow: 'auto' }}>
            {this.state.selected.map((obj, index) => {
              return (<Typography variant="body1" color="inherit">
                  <span style={this.state.comparisonStyles[index]}>
                    {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                  </span>
                </Typography>)
            })}
            </div>
        </List>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
        {this.state.comparisons.length ? 
          (<Button
            variant='contained' 
            color='primary'
            size='small'
            onClick={this.toggleEditing}
          >
          Compare
          </Button>)
          :(null)
        }
        </div>
      </div>);
    if (this.state.noEmail) {
      return <p> Please log in to your CookBook account! </p>
    } else if (this.state.isSaving) {
      if (this.state.saved) {
        return <p> {this.state.savedNum} ingredients saved to your grocery list! </p>
      } else {
        return <p> Saving... </p>
      }
    } else {
      return selectedScreen;
    }
  }
}

export default Recipe;