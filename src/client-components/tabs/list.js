/* global chrome */

import React from 'react';

import { Button, Checkbox, ListItemText, Switch, TextField, Typography } from '@material-ui/core';
import { ClipLoader } from 'react-spinners';
import ListWrapper from '@material-ui/core/List';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import InputList from './sub-components/inputList';
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
      switched: true,
      isDeleteScreen: false,
      isLoading: true,
    }

    this.deleteSelected = this.deleteSelected.bind(this);
    this.getGroceryList = this.getGroceryList.bind(this);
    this.groceryListToPantry = this.groceryListToPantry.bind(this);
    //this.postToGroceryList = this.postToGroceryList.bind(this);

    this.handleCheck = this.handleCheck.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getGroceryList();
  }

  deleteSelected() {
    this.setState({
      isLoading: true,
    });
    let toDelete = [];
    this.state.list.forEach((ingredient, index) => {
      if (this.state.checked[index]) {
        ingredient.quantity = 0;
        toDelete.push(ingredient);
      }
    });
    axios.post(`http://${IP}/api/grocerylist/`,
      { email: this.props.email,
        ingredients: toDelete,
        shouldReplace: true
      }).then(() => {
        this.getGroceryList();
      }).catch(error => {
        console.log('Error in deleting ingredients from grocery list:', error);
      });
  }

  getGroceryList() {
    axios.get(`http://${IP}/api/grocerylist/${this.props.email}`) 
      .then(results => {
        let newChecked = this.state.checked.slice();
        results.data.forEach((ingredient, index) => {
          newChecked[index] = ingredient.ispurchased || false;
        });
        this.setState({
          checked: newChecked,
          list: results.data,
          isLoading: false,
        });
      }).catch(error => {
        console.log('Error in getting grocery list:', error);
      });
    }

  groceryListToPantry() {
    this.setState({
      isLoading: true,
    });
    axios.post(`http://${IP}/api/grocerylistintopantry`,
    { email: this.props.email,
      ingredients: this.state.list,
      shouldReplace: true
    }) 
    .then(() => {
      this.getGroceryList();
    }).catch(err => {
      if (err.request._hasError || err.response.request.status === 404) {
        console.log('ERROR purchasing ingredients', err);
        alert('Trouble connecting to server. Please try again later.');
      }
      else if (err.response) {
        console.log('ERROR converting units', err.response.request.response);
        alert('Invalid unit conversion', err.response.request.response);
      }
    });
    }
    
  handleCheck(index) {
    let newChecked = this.state.checked.slice();
    newChecked[index] = !this.state.checked[index]; 
    let newList = this.state.list.slice();
    newList[index].ispurchased = !newList[index].ispurchased;
    this.setState({
      checked: newChecked,
      list: newList,
    });
    axios.post(`http://${IP}/api/grocerylistcheckboxes`,
      { email: this.props.email,
        ingredients: this.state.list.slice(index, index + 1),
        shouldReplace: true
      }).catch(error => {
        console.log('Error in saving checkbox status:', error);
      });
  }

  handleSwitch() {
    this.setState({
      isDeleteScreen: !this.state.isDeleteScreen,
      switched: !this.state.switched,
    });
  }

  handleTyping(e) {
    this.setState({
      item: e.target.value,
    });
  }

  // postToGroceryList() {
  //   axios.post(`http://${IP}/api/parse/`,
  //   { ingredients: [this.state.item] }) 
  //   .then((results) => {
  //     let newList = this.state.list.slice();
  //     newList.push(results.data);
  //     this.setState({
  //       list: this.state.list.concat(results.data),
  //     });
  //   }).catch(error => {
  //     console.log('Error in posting to grocery list:', error);
  //   });
  // }
  
  //====================================================
  render() {
    return (
        <div style={styles.container}>
          <ListWrapper>
            <ListItemText primary='My Grocery List:' style={{ width: '70%', margin: 'auto' }}/>
            <div style={{ height: 142.5, maxHeight: 142.5, overflow: 'auto'}}>
              <div style={{ width: '80%', margin: 'auto' }}>
                {this.state.isLoading ? 
                (<div style={{ width: "20%", margin: "auto" }}>
                <div style={{ position: "absolute", top: "50%" }}>
                 <ClipLoader
                  color={'orange'} 
                /></div></div>)
                  :(this.state.list.map((obj, index) => {
                  return (
                  <Typography variant='body1' color='inherit'>
                      <Checkbox 
                        color='primary'
                        style={{ width: 25, height: 25 }}
                        icon={<CheckBoxOutlineBlankIcon style={{ fontSize: 16 }} />}
                        checkedIcon={<CheckBoxIcon style={{ fontSize: 16 }} />}
                        checked={this.state.checked[index]}
                        onChange={() => this.handleCheck(index)}
                      />
                      {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                    </Typography>)})
                  )}
                </div>
              </div>
          </ListWrapper>
          <div style={{ textAlign: 'center' }}>
          <div>
            <Switch
                checked={this.state.switched}
                onChange={() => this.handleSwitch()}
                color="primary"
            />
          </div>
          <div style={{ marginBottom: 10 }}>
          { this.state.isDeleteScreen ? 
            (<Button
              variant='contained' 
              color='primary'
              size='small'
              onClick={this.deleteSelected}
            >
            Delete Selected
            </Button>)
            :(<Button
              variant='contained' 
              color='primary'
              size='small'
              onClick={this.groceryListToPantry}
            >
            Selected To Pantry
            </Button>)
          }
          </div>
          <div style={{ width: '90%', margin: 'auto' }}>
          <InputList number={1} 
                   type='empty'
                   endpoint='grocerylist'
                   email={this.props.email}
                   getIngredients={this.getGroceryList}
                   toggleEditing={this.toggleEditing}/>
          </div>
          </div>
        </div>
    )
  }
}

export default List;