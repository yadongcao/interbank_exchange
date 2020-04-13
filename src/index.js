import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App.js';
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import rootReducer from './reducers/reducer.js'
// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';
import'./styles/style.css';

const store = createStore(rootReducer)

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
,document.getElementById('root'));
