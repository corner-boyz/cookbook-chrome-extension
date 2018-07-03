/* global chrome */

import React from 'react';

import { Button, Checkbox, ListItemText, Switch, TextField, Typography } from '@material-ui/core';
import ListWrapper from '@material-ui/core/List';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
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
      checked: [],
      isDeleteScreen: true,
    }

    this.getGroceryList = this.getGroceryList.bind(this);
    this.postToGroceryList = this.postToGroceryList.bind(this);

    this.handleCheck = this.handleCheck.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getGroceryList();
  }

  getGroceryList() {
    axios.get(`http://${IP}/api/grocerylist/${this.props.email}`) 
      .then(results => {
        this.setState({
          list: results.data,
        });
      }).catch(error => {
        console.log('Error in getting grocery list:', error);
      });
  }

  handleCheck(index) {
    let newChecked = this.state.checked.slice();
    newChecked[index] = !this.state.checked[index]; 
    this.setState({
      checked: newChecked,
    });
  }

  handleSwitch() {
    this.setState({
      isDeleteScreen: !this.state.isDeleteScreen,
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
      });
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
              {this.state.list.map((obj, index) => {
                return (
                <Typography variant='body1' color='inherit'>
                    <Checkbox 
                      color='primary'
                      style={{ width: 25, height: 25 }}
                      icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 16 }} />}
                      checkedIcon={<CheckBoxIcon style={{ fontSize: 16 }} />}
                      checked={this.state.checked[index]}
                      onChange={() => this.state.handleCheck(index)}
                    />
                    {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                  </Typography>)
              })}
              </div>
          </ListWrapper>
          <div style={{ textAlign: 'center' }}>
          <div>
            <Switch
                checked={this.state.checked[0]}
                onChange={() => this.handleSwitch()}
                color="primary"
            />
          </div>
          { this.state.isDeleteScreen ? 
            (<Button
              variant='contained' 
              color='primary'
              size='small'
              onClick={this.postToGroceryList}
            >
            Delete Selected
            </Button>)
            :(<Button
              variant='contained' 
              color='primary'
              size='small'
              onClick={this.postToGroceryList}
            >
            Selected To Pantry
            </Button>)
          }
          <br></br>
          <TextField
            style={{ height: 40, width: '100%' }}
            placeholder='Add an Item'
            value={this.state.item}
            onChange={this.handleTyping}
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