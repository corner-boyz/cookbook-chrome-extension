/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ListWrapper from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class List extends React.Component {
  constructor(props) {
    super(props);
  }
  //====================================================
  componentDidMount() {
  }

  compare() {
  }
  
  //====================================================
  render() {
    return (
      <div style={styles.container}>
        <ListWrapper>
          <ListItemText primary='Your Grocery List:'/>
          {this.props.ingredients.map(obj => {
            return <ListItemText primary={`${obj.quantity || ''} ${obj.unit || ''} ${obj.ingredient}`}
                                 size="small"/>;
          })}
        </ListWrapper>
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

export default List;