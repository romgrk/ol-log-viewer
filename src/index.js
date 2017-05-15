
window.IS_ELECTRON = window.process ? true : false

if (!window.IS_ELECTRON)
  window.require = () => ({})

const fs = window.require('fs')
const { join } = window.require('path')

import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { compose, createStore, applyMiddleware } from 'redux';

import { getNewestFile } from './utils';
import { setFileByPath } from './actions';
import { rootReducer } from './reducers';
//import { setInformation } from './actions';
import App from './components/App';
import './styles.css';


const logsPath = 'C:\\ProgramData\\Objectif Lune\\PlanetPress Workflow 8\\PlanetPress Watch\\Log'

const initialState = {}

const store =
  (process.env.NODE_ENV === 'production')
  ? createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware))
  : createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware, createLogger()))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)


if (window.IS_ELECTRON)
  fs.readdir(logsPath, (err, files) => {
    const newestFile = getNewestFile(logsPath, files.filter(f => f.startsWith('ppw')))
    store.dispatch(setFileByPath(join(logsPath, newestFile)))
  })


if (module.hot) {
  module.hot.accept(['./reducers', './components/App'], () => {
    const NextApp = require('./components/App').default;
    render(
      <Provider store={store}>
        <NextApp />
      </Provider>,
      document.querySelector('#root')
    );
  });
}
