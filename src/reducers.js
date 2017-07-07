import { combineReducers } from 'redux';

import {
    SET_FILE
  , SET_FILE_CONTENT
  , SET_FILE_NAME
  , SET_FILE_PATH
  , SET_LOGS
  , SET_SEARCH
  , SET_PROCESS_VISIBILITY
  , SET_LEVEL_VISIBILITY
  , SET_SIDEBAR_VISIBILITY
  , TOGGLE_SIDEBAR_VISIBILITY
  , SET_LOG_DENSITY
  , SET_LOG_FOLDED
  , SET_LOG_SHOW_ALL
  , FOLD_ALL
  , UNFOLD_ALL
  , SCROLL_BOTTOM
  , SCROLL_TOP
  , SET_SCROLL
  , RESIZE
  , SET_SERVICE_STATE
  , UPDATE_SERVICE_STATE
} from './actions';
import {
    createDefaultFilters
  , createDefaultServices
  , createDefaultUI
} from './models';

function fileReducer(state = {}, action) {
  switch (action.type) {
    case SET_FILE: {
      document.title = `Log Viewer - ${action.name}`
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
      document.title = `Log Viewer - ${action.name}`
      return { ...state, name: action.name }
    }
    case SET_FILE_PATH: {
      return { ...state, path: action.path }
    }
    default:
      return state;
  }
}

function uiReducer(state = createDefaultUI(), action) {
  switch (action.type) {
    case SET_LOG_DENSITY: {
      return { ...state, logDensity: action.value }
    }
    case TOGGLE_SIDEBAR_VISIBILITY: {
      return { ...state, sidebar: !state.sidebar }
    }
    case SET_SIDEBAR_VISIBILITY: {
      return { ...state, sidebar: action.visible }
    }
    case SCROLL_TOP: {
      return { ...state, lastScrollTop: +new Date() }
    }
    case SCROLL_BOTTOM: {
      return { ...state, lastScrollBottom: +new Date() }
    }
    case SET_SCROLL: {
      const canSeeNewLogs = state.scroll.current >= (state.scroll.max - 200)
      return { ...state, scroll: action.scroll, hasNewLogs: state.hasNewLogs && !canSeeNewLogs }
    }
    // for react-virtualized List recomputeHeight
    case RESIZE: {
      return { ...state, lastFoldedIndex: -1, lastFoldedTimestamp: +new Date() }
    }
    case SET_LOGS: {
      const canSeeNewLogs = state.scroll.current >= (state.scroll.max - 200)
      return { ...state, lastFoldedIndex: -1, lastFoldedTimestamp: +new Date(), hasNewLogs: action.hasNewLogs && !canSeeNewLogs }
    }
    case SET_SEARCH: {
      return { ...state, lastFoldedIndex: -1, lastFoldedTimestamp: +new Date() }
    }
    case SET_PROCESS_VISIBILITY: {
      return { ...state, lastFoldedIndex: -1, lastFoldedTimestamp: +new Date() }
    }
    case SET_LEVEL_VISIBILITY: {
      return { ...state, lastFoldedIndex: -1, lastFoldedTimestamp: +new Date() }
    }
    case SET_LOG_FOLDED: {
      return { ...state, lastFoldedIndex: action.index, lastFoldedTimestamp: +new Date() }
    }
    case SET_LOG_SHOW_ALL: {
      return { ...state, lastFoldedIndex: action.index, lastFoldedTimestamp: +new Date() }
    }
    case FOLD_ALL: {
      return { ...state, lastFoldedIndex: -1, lastFoldedTimestamp: +new Date() }
    }
    case UNFOLD_ALL: {
      return { ...state, lastFoldedIndex: -1, lastFoldedTimestamp: +new Date() }
    }
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
    case SET_LEVEL_VISIBILITY: {
      const levels = {
        ...state.levels,
        [action.level]: action.visible
      }
      return { ...state, levels }
    }
    default:
      return state;
  }
}

function servicesReducer(state = createDefaultServices(), action) {
  switch (action.type) {
    case UPDATE_SERVICE_STATE: {
      return state.map(service =>
        service.name !== action.name ?
          service : { ...service, isUpdating: action.isUpdating }
      )
    }
    case SET_SERVICE_STATE: {
      return state.map(service =>
        service.name !== action.name ?
          service
          : {
            ...service,
            state: action.state,
            description: action.description,
            pid: action.pid,
            isRunning:  action.state === '4',
            isStarting: action.state === '2',
            isStopping: action.state === '3',
            isStopped:  action.state === '1',
            isUpdating: false
          }
      )
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
    case SET_LOG_FOLDED: {
      const newState = [...state]
      newState[action.index] = { ...newState[action.index], folded: action.folded }
      return newState
    }
    case SET_LOG_SHOW_ALL: {
      const newState = [...state]
      newState[action.index] = { ...newState[action.index], showAll: action.showAll }
      return newState
    }
    case FOLD_ALL: {
      return state.map(log => ({ ...log, folded: true }))
    }
    case UNFOLD_ALL: {
      return state.map(log => ({ ...log, folded: false }))
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
  , services: servicesReducer
})

