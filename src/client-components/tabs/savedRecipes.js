/* global chrome */

import React from 'react';

import { Button, Grid, List, ListItemText, Typography } from '@material-ui/core';
import { ClipLoader } from 'react-spinners';
import InputList from './sub-components/inputList';
import styles from '../styles';

import IP from '../../IP';
import axios from 'axios';

//==================================================== 
class SavedRecipes extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      recipes: [],
      isLoading: true,
    };

    this.getRecipes= this.getRecipes.bind(this);
  }
  //====================================================
  componentDidMount() {
    this.getRecipes();
  }

  getRecipes() {
    axios.get(`http://${IP}/api/usercombinedrecipes/${this.props.email}`) 
      .then(results => {
        console.log('RECIPES', results);
        this.setState({
          recipes: results.data,
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
      return (
    <div style={styles.container}>
        <List>
          <ListItemText primary='Saved Recipes:' style={{ width: '70%', margin: 'auto' }}/> 
          <div style={{ height: 335, maxHeight: 335, overflow: 'auto'}}>
            {this.state.isLoading ? 
            (<div style={{ width: "20%", margin: "auto" }}>
            <div style={{ position: "absolute", top: "50%" }}>
             <ClipLoader
              color={'orange'} 
            /></div></div>)
            :(<div style={{ width: '85%', margin: 'auto' }}>
              {this.state.recipes.map(recipe => {
                return (
                    <Grid container style={{ marginBottom: 5 }}r>
                        <Grid item xs={3}><img src={recipe.imageurl || 'https://image.flaticon.com/icons/svg/60/60435.svg'} style={styles.circular} height="35" width="35" /></Grid>
                        <Grid item xs={9}><a href={recipe.sourceurl} onClick={() => window.open(recipe.sourceurl)}>{recipe.title}</a></Grid>
                    </Grid>);
              })}
            </div>)}
          </div>       
        </List>
      </div>);
  }
}

export default SavedRecipes;