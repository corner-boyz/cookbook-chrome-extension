/* global chrome */

import React from 'react';

import { Button, List, ListItemText, Typography } from '@material-ui/core';
import { ClipLoader } from 'react-spinners';
import InputList from './sub-components/inputList';
import styles from '../styles';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class Ingredients extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ingredients: [],
      editing: false,
      isLoading: true,
    };

    this.getIngredients = this.getIngredients.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getIngredients();
    console.log('EMAIL', this.props.email);
    console.log('NAME', this.props.name);
  }

  getIngredients() {
    axios.get(`http://${IP}/api/ingredients/${this.props.email}`) 
      .then(results => {
        this.setState({
          ingredients: results.data,
          isLoading: false,
        });
      }).then(this.compare)
      .catch(error => {
        console.log('Error in retrieving ingredients:', error);
      });
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    })
  }

  //====================================================
  render() {
    let ingredientsScreen = this.state.editing ?
      <InputList number={this.state.ingredients.length} 
                 type='given' 
                 given={this.state.ingredients} 
                 toggleEditing={this.toggleEditing}/>
      : (<div style={styles.container}>
        <List>
          <ListItemText primary='My Ingredients:' style={{ width: '70%', margin: 'auto' }}/> 
          <div style={{ height: 200, maxHeight: 200, overflow: 'auto'}}>
          {this.state.isLoading ? 
                (<div style={{ width: "20%", margin: "auto" }}>
                <div style={{ position: "absolute", top: "50%" }}>
                 <ClipLoader
                  color={'#0000FF'} 
                /></div></div>)
            :(<div style={{ width: '80%', margin: 'auto' }}>
              {this.state.ingredients.map(obj => {
                return (<Typography variant="body1" color="inherit">
                {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                </Typography>);
              })}
            </div>)}
          </div>       
        </List>
        <div style={{ textAlign: 'center' }}>
          <Button
            variant='contained' 
            color='primary'
            size='small'
            onClick={this.toggleEditing}>
            Edit
          </Button> 
        </div>
        <InputList number={1} 
                   type='empty'
                   email={this.props.email}
                   getIngredients={this.getIngredients}
                   toggleEditing={this.toggleEditing}/>
      </div>);
    

      return ingredientsScreen;
    }
  }

export default Ingredients;