import React from 'react';
import ReactDOM from 'react-dom';
import PopupOrModal from './PopupOrModal';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<PopupOrModal />, document.getElementById('root'));
registerServiceWorker();
