import React from 'react';

//====================================================
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ingredients: [],
      text: ''
    }

  }
  //====================================================
  componentDidMount() {
  }

  //====================================================
  render() {
    return (
      <div>
        <p>Welcome to your CookBook, what would you like to do?</p>
      </div>
    );
  };
}
//============================================================= Styling
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default Home;