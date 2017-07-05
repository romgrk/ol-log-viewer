/*
 * utils.js
 */

const fs = window.require('fs')
const { join } = window.require('path')

import iconv from 'iconv-lite';
import detect from 'charset-detector';
import leftpad from 'leftpad';
import rightpad from 'rightpad';

import { INPUT_ENCODING } from './constants';

/*
 * File related
 */

export function readFileFromInput(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsText(file, INPUT_ENCODING)
  })
}

export function readFileFromPath(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if (err)
        return reject(err)

      const matches  = detect(buffer)
      const encoding = matches.length > 0 ? matches[0].charsetName : 'utf8'

      resolve(iconv.decode(buffer, encoding))
    })
  })
}

export function getNewestFile(dirname, files) {
  const out = []

  files.forEach(file => {
    const stats = fs.statSync(join(dirname, file))
    if (stats.isFile())
      out.push({file: file, mtime: stats.mtime.getTime()})
  })

  out.sort((a,b) => b.mtime - a.mtime)

  return (out.length > 0) ? out[0].file : ''
}

/*
 * Logs related
 */

export function associateRuntimePerformance(logs) {

  const processes = {}

  logs.forEach(log => {
    if (log.elapsedTime) {
      if (!processes[log.runtimeName])
        processes[log.runtimeName] = []

      processes[log.runtimeName].push(getMilliseconds(parseTime(log.elapsedTime)))
    }
  })

  Object.keys(processes).forEach(p => {
    processes[p] =
      processes[p].reduce((acc, cur) => acc + cur, 0)
      / (processes[p].length || 1)
  })

  console.log(processes)

  logs.forEach(log => {
    if (log.elapsedTime) {
      log.ratio =
        getMilliseconds(parseTime(log.elapsedTime)) / processes[log.runtimeName]
    }
  })

  return logs
}

/*
 * Time related
 */

export function getMilliseconds(time) {
  return (
      time[0] * 60 * 60 * 1000
    + time[1]      * 60 * 1000
    + time[2]           * 1000
    + time[3]
  )
}

export function parseTime(timeString) {
  const m = timeString.match(/(\d{2}):(\d{2}):(\d{2})(?:[:.](\d{3}))?/)
  const hours        = +m[1]
  const minutes      = +m[2]
  const seconds      = +m[3]
  const milliseconds = +rightpad(m[4], 3, '0') || 0
  return [hours, minutes, seconds, milliseconds]
}

export function getElapsedTime(a, b) {
  const ta = parseTime(a)
  const tb = parseTime(b)

  const tc = [
    tb[0] - ta[0],
    tb[1] - ta[1],
    tb[2] - ta[2],
    tb[3] - ta[3]
  ]

  if (tc[1] < 0) {
    tc[1] = 60 + tc[1]
    tc[0] -= 1
  }
  if (tc[2] < 0) {
    tc[2] = 60 + tc[2]
    tc[1] -= 1
  }
  if (tc[3] < 0) {
    tc[3] = 1000 + tc[3]
    tc[2] -= 1
  }

  return (
            leftpad(tc[0], 2)
    + ':' + leftpad(tc[1], 2)
    + ':' + leftpad(tc[2], 2)
    + ':' + leftpad(tc[3], 4)
  )
}

export function renderElapsedTime(time) {
  if (time === undefined)
    return '—'

  const m = time.match(/(\d{2}):(\d{2}):(\d{2}):(\d{3})/)

  if (m === null)
    return ''

  const hours        = +m[1]
  const minutes      = +m[2]
  const seconds      = +m[3]
  const milliseconds = +m[4]

  if (hours > 0)
    return `${hours}h ${minutes}m`

  if (minutes > 0)
    return `${minutes}m ${seconds}s`

  if (seconds > 0)
    return `${seconds}.${leftpad(milliseconds, 3, '0')}s`

  return `${seconds}.${leftpad(milliseconds, 3, '0')}s`
}

/*
 * General
 */

export function promiseWhile(condition, action, value) {
  if (condition(value))
    return action(value).then(promiseWhile.bind(null, condition, action))
  return value
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
