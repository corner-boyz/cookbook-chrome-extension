/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class Ingredients extends React.Component {
  constructor(props) {
    super(props);
  }
  //====================================================
  componentDidMount() {
    this.props.update();
  }

  compare() {

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
    this.props.update();
  }
  //====================================================
  render() {
    return (
      <div style={styles.container}>
        <List>
        <ListItemText primary='Your Ingredients:'/>
        {this.props.ingredients.map(obj => {
          return <ListItemText primary={`${obj.quantity || ''} ${obj.unit || ''} ${obj.ingredient}`}
                               size="small"/>;
        })}
        </List>
        <TextField
          style={{ height: 40, width: '100%' }}
          placeholder='Add an Ingredient'
          onChange={(text) => this.props.screenProps.text = text}
          inputProps={{style: styles.textField}}
        />
        <Button
          variant='contained' 
          color='primary'
          size='small'
          onClick={this.submitIngredient}
        >
        Submit
        </Button>
        <Button
          variant='contained' 
          color='secondary'
          size='small'
          onClick={this.logOut}
        >
        Log Out
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

export default Ingredients;