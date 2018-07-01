/* global chrome */

import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ListWrapper from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import { Toolbar, Typography } from '@material-ui/core';
import styles from '../styles';


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
        <ListWrapper style={styles.list}>
          <ListItemText primary='My Grocery List:' style={{ width: '70%', margin: 'auto' }}/>
          <div style={{ width: '70%', margin: 'auto' }}>
            {this.props.ingredients.map(obj => {
              return (<Typography variant="body1" color="inherit">
                  {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                </Typography>)
            })}
          </div>
        </ListWrapper>
        <TextField
          style={{ height: 40, width: '100%' }}
          placeholder='Add an Item'
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

export default List;