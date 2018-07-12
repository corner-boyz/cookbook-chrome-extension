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
    this.saveScreen = this.saveScreen.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getIngredients();
  }

  getIngredients() {
    axios.get(`http://${IP}/api/ingredients/${this.props.email}`) 
      .then(results => {
        this.setState({
          ingredients: results.data,
          isLoading: false,
        });
      })
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

  saveScreen() {
    this.setState({
      isLoading: true,
    });
  }

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    })
  }

  //====================================================
  render() {
    let ingredientsScreen = this.state.editing ?
      (<div style={styles.container}> 
        <List>
          <ListItemText primary='Edit Ingredients:' style={{ width: '75%', margin: 'auto' }}/>
          <InputList number={this.state.ingredients.length} 
                 type='given' 
                 endpoint='ingredients'
                 email={this.props.email}
                 given={this.state.ingredients} 
                 getIngredients={this.getIngredients}
                 saveScreen={this.saveScreen}
                 toggleEditing={this.toggleEditing}/>
        </List>
      </div>)
      : (<div style={styles.container}>
        <List>
          <ListItemText primary='Saved Ingredients:' style={{ width: '70%', margin: 'auto' }}/> 
          <div style={{ height: 190, maxHeight: 190, overflow: 'auto'}}>
          {this.state.isLoading ? 
                (<div style={{ width: "20%", margin: "auto" }}>
                <div style={{ position: "absolute", top: "50%" }}>
                 <ClipLoader
                  color={'orange'} 
                /></div></div>)
            :(<div style={{ width: '70%', margin: 'auto' }}>
              {this.state.ingredients.map(obj => {
                return (<Typography variant="body1" color="inherit">
                {obj.quantity || ''} {obj.unit || ''} {obj.ingredient}
                </Typography>);
              })}
            </div>)}
          </div>       
        </List>
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <Button
            variant='contained' 
            color='primary'
            size='small'
            onClick={this.toggleEditing}>
            Edit
          </Button> 
        </div>
        <div style={{ width: '90%', margin: 'auto', textAlign: 'left' }}>
          <Typography style={{ width: '85%', margin: 'auto' }} variant='body1'>Add to Pantry:</Typography>
            <div style={{ width: '86%', margin: 'auto' }}>
            <InputList number={1} 
                    type='empty'
                    endpoint='ingredients'
                    email={this.props.email}
                    getIngredients={this.getIngredients}
                    toggleEditing={this.toggleEditing}/>
            </div>
          </div>
      </div>);
    

      return ingredientsScreen;
    }
  }

export default Ingredients;