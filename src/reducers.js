import { combineReducers } from 'redux';

import {
   SET_FILE
 , SET_FILE_CONTENT
 , SET_FILE_NAME
 , SET_FILE_PATH
 , SET_LOGS
 , SET_SEARCH
 , SET_PROCESS_VISIBILITY
} from './actions';
import {
  createDefaultFilters
} from './models';

function fileReducer(state = {}, action) {
  switch (action.type) {
    case SET_FILE: {
      return {
        name: action.name,
        path: action.path,
        content: action.content
      }
    }
    case SET_FILE_CONTENT: {
      return { ...state, content: action.content }
    }
    case SET_FILE_NAME: {
      return { ...state, name: action.name }
    }
    case SET_FILE_PATH: {
      return { ...state, path: action.path }
    }
    default:
      return state;
  }
}

function uiReducer(state = {}, action) {
  switch (action.type) {
    default:
      return state;
  }
}

function filtersReducer(state = createDefaultFilters(), action) {
  switch (action.type) {
    case SET_LOGS: {
      return { ...state, processes: action.processes }
    }
    case SET_SEARCH: {
      return { ...state, searchValue: action.value, searchTerms: action.terms }
    }
    case SET_PROCESS_VISIBILITY: {
      const processes = {
        ...state.processes,
        [action.process]: action.visible
      }
      return { ...state, processes }
    }
    default:
      return state;
  }
}

function logsReducer(state = [], action) {
  switch (action.type) {
    case SET_LOGS: {
      return action.logs
    }
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
    ui: uiReducer
  , filters: filtersReducer
  , file: fileReducer
  , logs: logsReducer
})

