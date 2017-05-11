/*
 * actions.js
 */

const fs   = window.require('fs')
const { basename } = window.require('path')

import { readFile } from './utils';
import { parseLogFile } from './parsers';

export const SET_FILE         = 'SET_FILE'
export const SET_FILE_CONTENT = 'SET_FILE_CONTENT'
export const SET_FILE_NAME    = 'SET_FILE_NAME'
export const SET_FILE_PATH    = 'SET_FILE_PATH'

export const SET_LOGS         = 'SET_LOGS'

export const SET_SEARCH             = 'SET_SEARCH'
export const SET_PROCESS_VISIBILITY = 'SET_PROCESS_VISIBILITY'


let watcher

export function setFile(file) {
  return (dispatch, getState) => {
    const state = getState()
    if (watcher) {
      watcher.close()
    }

    readFile(file)
    .then(content => {
      dispatch({
        type: SET_FILE,
        name: file.name,
        path: file.path,
        content
      })

      const logs = parseLogFile(content)
      const processes = {}

      logs.forEach(log => processes[log.process] = true)

      dispatch({ type: SET_LOGS, logs: logs, processes: processes })

      watcher = fs.watch(file.path, (type, filename) => {
        fs.readFile(file.path, (err, buffer) => {
          if (err)
            return console.error(err)

          dispatch(setFileContent(buffer.toString()))
        })
      })

    })
    .catch(error => { })
  }
}

export function setFileByPath(path) {
  return (dispatch, getState) => {

    const state = getState()
    if (watcher) {
      watcher.close()
    }

    fs.readFile(path, (err, buffer) => {
      if (err)
        return console.error(err)

      const content = buffer.toString()

      dispatch({
        type: SET_FILE,
        name: basename(path),
        path: path,
        content
      })

      const logs = parseLogFile(content)
      const processes = {}

      logs.forEach(log => processes[log.process] = true)

      dispatch({ type: SET_LOGS, logs: logs, processes: processes })

      watcher = fs.watch(path, (type, filename) => {
        fs.readFile(path, (err, buffer) => {
          if (err)
            return console.error(err)

          dispatch(setFileContent(buffer.toString()))
        })
      })
    })
  }
}

export function setFileContent(content) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_FILE_CONTENT,
      content
    })

    const logs = parseLogFile(content)
    const processes = {}

    logs.forEach(log => processes[log.process] = true)

    dispatch({ type: SET_LOGS, logs: logs, processes: processes })
  }
}

export function setSearch(value) {
  return {
    type: SET_SEARCH,
    terms: value.split(' '),
    value
  }
}

export function setProcessVisibility(process, visible) {
  return {
    type: SET_PROCESS_VISIBILITY,
    process,
    visible
  }
}
