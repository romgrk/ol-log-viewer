/*
 * actions.js
 */

import {
  readFileFromInput,
  readFileFromPath,
  associateRuntimePerformance,
  promiseWhile,
  delay
} from './utils';
import { parseLogFile } from './parser';
import { parseLogFile as advancedParseLogFile } from './advanced-parser';
import * as Services from './services';

export const SET_FILE         = 'SET_FILE'
export const SET_FILE_CONTENT = 'SET_FILE_CONTENT'
export const SET_FILE_NAME    = 'SET_FILE_NAME'
export const SET_FILE_PATH    = 'SET_FILE_PATH'

export const SET_LOGS         = 'SET_LOGS'

export const SET_SEARCH             = 'SET_SEARCH'
export const SET_PROCESS_VISIBILITY = 'SET_PROCESS_VISIBILITY'
export const SET_LEVEL_VISIBILITY   = 'SET_LEVEL_VISIBILITY'

export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY'
export const TOGGLE_SIDEBAR_VISIBILITY = 'TOGGLE_SIDEBAR_VISIBILITY'
export const SET_LOG_DENSITY = 'SET_LOG_DENSITY'
export const SET_LOG_FOLDED  = 'SET_LOG_FOLDED'

export const UNFOLD_ALL = 'UNFOLD_ALL'
export const FOLD_ALL   = 'FOLD_ALL'

export const SET_SERVICE_STATE    = 'SET_SERVICE_STATE'
export const UPDATE_SERVICE_STATE = 'UPDATE_SERVICE_STATE'

const { watch }    = window.require('fs')
const { basename } = window.require('path')


let watcher

export function setFile(file) {
  return (dispatch, getState) => {
    if (watcher) {
      watcher.close()
    }

    readFileFromInput(file)
    .then(content => {
      dispatch({
        type: SET_FILE,
        name: file.name,
        path: file.path,
        content
      })

      dispatch(setLogs(content))

      if (window.IS_ELECTRON)
        watcher = watch(file.path, (type, filename) => {
          readFileFromPath(file.path)
          .then(content => dispatch(setFileContent(content)))
          .catch(err => console.error(err))
        })

    })
    .catch(err => console.error(err))
  }
}

// only-on-desktop
export function setFileByPath(path) {
  return (dispatch, getState) => {
    if (watcher) {
      watcher.close()
    }

    readFileFromPath(path)
    .then(content => {
      dispatch({
        type: SET_FILE,
        name: basename(path),
        path: path,
        content
      })

      dispatch(setLogs(content))

      watcher = watch(path, (type, filename) => {
        readFileFromPath(path)
        .then(content => dispatch(setFileContent(content)))
        .catch(err => console.error(err))
      })
    })
    .catch(err => console.error(err))
  }
}

export function setFileContent(content) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_FILE_CONTENT,
      content
    })

    dispatch(setLogs(content))
  }
}

export function setLogs(content) {
  return (dispatch, getState) => {
    const state = getState()

    const processes = {}

    const logs =
      associateRuntimePerformance(
        advancedParseLogFile(content) || parseLogFile(content))

    logs.forEach(log => {
      log.folded = log.type === 'process' ? false : true
      processes[log.process] = true
    })

    Object.keys(state.filters.processes).forEach(process => {
      if (!state.filters.processes[process] && processes[process])
        processes[process] = false
    })

    dispatch({ type: SET_LOGS, logs: logs, processes: processes })
  }
}

export function setLogFolded(index, folded) {
  return {
    type: SET_LOG_FOLDED,
    index,
    folded
  }
}

export function foldAll() {
  return {
    type: FOLD_ALL
  }
}

export function unfoldAll() {
  return {
    type: UNFOLD_ALL
  }
}


export function setSearch(value) {
  return (dispatch, getState) => {
    if (value !== '')
      dispatch(unfoldAll())

    dispatch({
      type: SET_SEARCH,
      terms: value.split(' '),
      value
    })
  }
}

export function setProcessVisibility(process, visible) {
  return {
    type: SET_PROCESS_VISIBILITY,
    process,
    visible
  }
}

export function setLevelVisibility(level, visible) {
  return {
    type: SET_LEVEL_VISIBILITY,
    level,
    visible
  }
}

export function setSidebarVisibility(visible) {
  return {
    type: SET_SIDEBAR_VISIBILITY,
    visible
  }
}

export function toggleSidebarVisibility() {
  return {
    type: TOGGLE_SIDEBAR_VISIBILITY
  }
}

export function setLogDensity(value) {
  return {
    type: SET_LOG_DENSITY,
    value
  }
}


// only-on-desktop
export function updateServiceState(name, isUpdating = true) {
  return {
    type: UPDATE_SERVICE_STATE,
    name,
    isUpdating
  }
}

// only-on-desktop
export function setServiceState(name, result) {
  return {
    type: SET_SERVICE_STATE,
    state: result.state,
    description: result.description,
    pid: result.pid,
    name
  }
}

// only-on-desktop
export function updateAllServices() {
  return (dispatch, getState) => {
    const { services } = getState()

    services.forEach(service => {
      if (service.isUpdating)
        return

      dispatch(updateServiceState(service.name))

      Services.getState(service.name)
      .then(result => {
        dispatch(setServiceState(service.name, result))
      })
      .catch(err => {
        console.error(err)
        dispatch(updateServiceState(service.name, false))
      })
    })
  }
}

// only-on-desktop
export function stopService(service) {
  return (dispatch, getState) => {
    if (!service.isRunning)
      return

    dispatch(updateServiceState(service.name))

    Services.stop(service.name)
    .catch(err => console.error(err))
    .then(() => queryServiceStateUntilDone(dispatch, service))
  }
}

// only-on-desktop
export function startService(service) {
  return (dispatch, getState) => {
    if (service.isRunning)
      return

    dispatch(updateServiceState(service.name))

    Services.start(service.name)
    .catch(err => console.error(err))
    .then(() => queryServiceStateUntilDone(dispatch, service))
  }
}

// only-on-desktop
export function killService(service) {
  return (dispatch, getState) => {
    if (!service.isRunning)
      return

    dispatch(updateServiceState(service.name))

    Services.kill(service.pid)
    .catch(err => console.error(err))
    .then(() => queryServiceStateUntilDone(dispatch, service))
  }
}

// only-on-desktop
function queryServiceStateUntilDone(dispatch, service) {
  const query = () =>
    delay(200).then(() => Services.getState(service.name))

  const condition = res =>
    res && res.state !== '1' && res.state !== '4'

  return query()
  .then(firstResult => promiseWhile(condition, query, firstResult))
  .then(result => {
    dispatch(setServiceState(service.name, result))
    dispatch(updateAllServices())
  })
  .catch(err => {
    console.error(err)
    dispatch(updateServiceState(service.name, false))
  })
}

