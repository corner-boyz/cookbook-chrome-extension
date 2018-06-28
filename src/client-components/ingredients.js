import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

//==================================================== 'index' state is required for refreshing the ingredient's list;
class Ingredients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    }

  }
  //====================================================
  componentDidMount() {
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
        <p>Here are your Ingredients:</p>
        {/* <List
          // style={styles.list}
        > */}
        {/* <FlatList
          style={styles.list}
          data={this.props.screenProps.ingredients}
          extraData={this.state.index}
          renderItem={
            ({ item }) =>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text
                  style={{ flex: 1, flexDirection: 'row', backgroundColor: 'gold' }}
                >{item.ingredient}</Text>
                <Text
                  style={{ flex: 1, flexDirection: 'row', backgroundColor: 'yellow' }}
                >{item.quantity}{item.unit}</Text>
              </View>
          }
          keyExtractor={(item, index) => item.ingredient}
        /> */}
        {/* </List> */}
        <TextField
          style={{ height: 40, width: 250 }}
          placeholder='Add an Ingredient'
          onChange={(text) => this.props.screenProps.text = text}
        />
        <Button
          variant='contained' 
          color='primary'
          size='small'
          onPress={() => {
            this.submitIngredient();
          }}
        >
        Submit
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
  }
};

export default Ingredients;