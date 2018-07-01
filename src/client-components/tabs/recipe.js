/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
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
      comparisonStyles: [],
    }

    this.compare = this.compare.bind(this);
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
          results.data.forEach((comparison, index) => {
            if (comparison.quantity > 0) {
              this.state.comparisonStyles[index] = {
                color: '#78AB46'
              }
            } else {
              this.state.comparisonStyles[index] = {
                color: 'red'
              }
            }
          });
        }).catch(error => {
          console.log('Error in comparing selection:', error);
        });
  }

  getIngredients() {
    axios.get(`http://${IP}/api/ingredients/a@a.com`) 
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
    let newIngredient = {
      name: this.props.screenProps.text,
      quantity: 99
    };
    this.props.screenProps.ingredients.push(newIngredient)
    this.setState({
      index: this.state.index + 1
    })
  }
  //====================================================
  render() {
    return (
      <div style={styles.container}>
        <List style={styles.list}>
          <ListItemText primary='Selected Ingredients:' style={{ width: '90%', margin: 'auto' }}/>
          {/* <ul style={{listStyleType: 'none'}}> */}
            {this.state.selected.map((obj, index) => {
              // return <li style={this.state.comparisonStyles[index]}>
              //   {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
              // </li>
              return (
                <Typography variant="body1" color="inherit">
                  <span style={this.state.comparisonStyles[index]}>
                    {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                  </span>
                </Typography>
              )
            })}
          {/* </ul> */}
        </List>
        <Button
          variant='contained' 
          color='primary'
          size='small'
          onClick={this.compare}
        >
        Add to List
        </Button>
      </div>
    )
  }
}

export default Recipe;