/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class Recipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
    }
  }
  //====================================================
  componentDidMount() {
    this.getSelected();
  }

  compare() {

  }

  getSelected() {
    chrome.storage.sync.get(['selected'], result => {
      if (result.selected.ingredients) {
        axios.post(`http://${IP}/api/parse`, {
          ingredients: result.selected.ingredients,
        }).then(results => {
          console.log('GOT SELECTED', results.data);
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
        <List>
          <ListItemText primary='Selected Ingredients:'/>
          {this.state.selected.map(obj => {
            return <ListItemText primary={`${obj.quantity || ''} ${obj.unit || ''} ${obj.ingredient}`}
                                size="small"/>;
          })}
        </List>
        <Button
          variant='contained' 
          color='primary'
          size='small'
          onClick={this.submitIngredient}
        >
        Compare
        </Button>
      </div>
    )
  }
}
//==================================================== 
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: 350,
    backgroundColor: 'white'
    // justifyContent: 'center',
  },
  textField:{
    fontSize: 12
  },
};

export default Recipe;