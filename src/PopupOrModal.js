/* global chrome */

import React from 'react';
import App from './App';
import Recipe from './client-components/tabs/recipe';
import { ClipLoader } from 'react-spinners';

class PopupOrModal extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      isLoading: true,
      isModal: false,
    };
  }

  componentDidMount() {
    chrome.storage.sync.get(['isModal'], result => {
      if (result.isModal) {
        chrome.storage.sync.set({
          'isModal': false
        });
        this.setState({
          isModal: true,
        });
      } 
      this.setState({
        isLoading: false,
      });
    });
    // If this does not work, it should still load after 3 seconds
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 3000);
  }
  

  
  render() {
    if (this.state.isLoading) {
      return  <div style={{ width: "20%", margin: "auto" }}>
              <div style={{ position: "absolute", top: "50%" }}>
               <ClipLoader
                color={'#0000FF'} 
                loading={this.state.isLoading} 
              /></div></div>
    } else {
      if (this.state.isModal) {
        return <Recipe/>;
      } else {
        return <App />;
      }
    }
    // });
    // return (
    //   <BrowserRouter>
    //   <div>
    //     <Route exact path={this.url} component={App} />
    //     <Route path={`${this.url}/modal`} component={Recipe} />
    //   </div>
    //   </BrowserRouter>
    // )
  }
}

export default PopupOrModal;
