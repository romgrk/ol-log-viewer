import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import { getNewestFile } from './utils';
import { rootReducer } from './reducers';
import {
    setFileByPath
  , updateAllServices
  , silentUpdateAllServices
} from './actions';
import App from './components/App';
import './styles.css';


window.POLL_SERVICES = false || process.env.NODE_ENV === 'production'

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


if (window.IS_ELECTRON) {
  const fs = window.require('fs')
  const { join } = window.require('path')

  // Load current log file
  fs.readdir(logsPath, (err, files) => {
    const newestFile = getNewestFile(logsPath, files.filter(f => f.startsWith('ppw')))
    store.dispatch(setFileByPath(join(logsPath, newestFile)))
  })

  // Update services state
  store.dispatch(updateAllServices())

  setInterval(() => window.POLL_SERVICES && store.dispatch(silentUpdateAllServices()), 5000)
}


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
