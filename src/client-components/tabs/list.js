/* global chrome */

import React from 'react';

import { Button, TextField, ListItemText, Typography } from '@material-ui/core';
import ListWrapper from '@material-ui/core/List';
import styles from '../styles';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: '',
      list: [],
    }

    this.getGroceryList = this.getGroceryList.bind(this);
    this.postToGroceryList = this.postToGroceryList.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getGroceryList();
  }

  getGroceryList() {
    // chrome.storage.sync.get(['list'], result => {
    //   if (result.list && result.list.length){
    //     console.log('MATCH');
    //     this.setState({
    //       list: result.list,
    //     });

    //   }
    // });
    axios.get(`http://${IP}/api/grocerylist/a@a.com`) 
      .then(results => {
        this.setState({
          list: results.data,
        });
      }).catch(error => {
        console.log('Error in getting grocery list:', error);
      });
  }

  handleTyping(e) {
    this.setState({
      item: e.target.value,
    });
  }

  postToGroceryList() {
    
    axios.post(`http://${IP}/api/parse/`,
    { ingredients: [this.state.item] }) 
    .then((results) => {
      let newList = this.state.list.slice();
      newList.push(results.data);
      this.setState({
        list: this.state.list.concat(results.data),
      })
      // let newList = [];
      // newList.push(results.data);
      // chrome.storage.sync.set({
      //   'list': newList,
      // });
      // this.setState({
      //   list: newList,
      // });
    }).catch(error => {
      console.log('Error in posting to grocery list:', error);
    });
  }
  
  //====================================================
  render() {
    return (
        <div style={styles.container}>
          <ListWrapper style={styles.list}>
            <ListItemText primary='My Grocery List:' style={{ width: '70%', margin: 'auto' }}/>
            <div style={{ width: '80%', margin: 'auto' }}>
              {this.state.list.map(obj => {
                return (<Typography variant="body1" color="inherit">
                    {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                  </Typography>)
              })}
              </div>
          </ListWrapper>
          <div style={{ textAlign: 'center' }}>
          <Button
            variant='contained' 
            color='primary'
            size='small'
            onClick={this.postToGroceryList}
          >
          Selected To Pantry
          </Button>
          <TextField
            style={{ height: 40, width: '100%' }}
            placeholder='Add an Item'
            value={this.state.item}
            onChange={this.handleTyping.bind(this)}
            inputProps={{ style: styles.textField}}
          />
          <Button
            variant='contained' 
            color='primary'
            size='small'
            onClick={this.postToGroceryList}
          >
          Add
          </Button>
          </div>
        </div>
    )
  }
}

export default List;