
import { getElapsedTime } from './utils';

import {
    string
  , regexp
  , seq
  , alt
  , any
  , custom
} from 'parsimmon';


const I = x => x

const tag = name => value => {
  value.tag = name
  return value
}

const notChar = (char) =>
  custom((success, failure) =>
    (input, i) =>
      (input.charAt(i) !== char) ?
          success(i + 1, input.charAt(i))
        : failure(i, 'anything different than "' + char + '"'))

const everythingUntil = (str) =>
  custom((success, failure) =>
    (input, i) => {
      const startIndex = input.indexOf(str, i)

      if (startIndex === -1)
        return failure(i, `failed to find "${str}"`)

      return success(startIndex + str.length, input.slice(i, startIndex))
    })


const dashLine = regexp(/-+\r\n/)

const processLog = seq(
  /* 0 */   dashLine
  /* 1 */ , string('WPROC: ')
  /* 2 */ , regexp(/.*(?= \(thread id: )/)
  /* 3 */ , string(' (thread id: ')
  /* 5 */ , everythingUntil(') - ')
  /* 6 */ , everythingUntil('\r\n')
  /* 7 */ , everythingUntil('WPROC: ')
  /* 8 */ , everythingUntil('elapsed time: ')
  /* 9 */ , everythingUntil(')\r\n\r\n')
  )
  .map(tag('process'))

const pendingProcessLog = seq(
  /* 0 */   dashLine
  /* 1 */ , string('WPROC: ')
  /* 2 */ , regexp(/.*(?= \(thread id: )/)
  /* 3 */ , string(' (thread id: ')
  /* 5 */ , everythingUntil(') - ')
  /* 6 */ , everythingUntil('\r\n')
  /* 7 */ , any.many().map(vs => vs.join(''))
  )
  .map(tag('process'))

const startLog =
  alt(
      string('\r\n')
        .map(v => '')
    , seq(notChar('-'), everythingUntil('\r\n'))
        .map(v => v[0] + v[1])
  ).atLeast(1)
  .map(tag('startup'))

//const parser = alt(processLog, startLog).many()

const parser =
  alt(
      startLog
    , processLog
    , pendingProcessLog
  ).many()

//const util = require('util')
//util.inspect.defaultOptions.colors = true
//util.inspect.defaultOptions.depth = 6

//const logPath = 'mod.log'
//console.log(parseLogFile(require('fs').readFileSync(logPath).toString()))

export function parseLogFile(content) {
  const result = parser.parse(content)

  console.log(result.value)

  if (result.status)
    return extractLogs(result.value)

  console.error(result)

  return undefined
}

function extractLogs(result) {
  return result.map((log, i) =>
    log.tag === 'process' ? extractProcessLog(log, i) : extractStartLog(log, i)
  )
}

function extractProcessLog(result, i) {
  const name = result[2]

  const startTime = result[5]
  const content   = result[6]
  const lines = content.split('\r\n').slice(1).filter(line => !/^\s*$/.test(line))

  const inProgress  = result.length <= 7
  const elapsedTime = !inProgress ? result[8] : undefined

  const hasError   = lines.some((line) => /^ERROR/.test(line))
  const hasWarning = lines.some((line) => /^WARN/.test(line))
  const hasDebug   = lines.some((line) => /^DEBUG/.test(line))
  const hasInfo    = lines.some((line) => /^INFO/.test(line))

  const level =
    hasError ? 'error' :
    hasWarning ? 'warning' :
    hasDebug ? 'debug' : 'info'

  const process = name.replace(/_[0-9A-Z]{15}$/, '')

  return {
      type: 'process'
    , index:       i
    , process:     process
    , name:        name
    , inProgress:  inProgress
    , start:       extractTimestamp(startTime)
    , elapsedTime: elapsedTime
    , lines:       lines.map(parseLine)
    , hasError:    hasError
    , hasWarning:  hasWarning
    , hasDebug:    hasDebug
    , hasInfo:     hasInfo
    , level:       level
  }
}

function extractStartLog(result, i) {
  const lines = result.map(I)

  const hasError = lines.some((line) => /^ERROR/.test(line)) 
  const hasWarning = lines.some((line) => /^WARN/.test(line))  
  const hasDebug = lines.some((line) => /^DEBUG/.test(line)) 
  const hasInfo = lines.some((line) => /^INFO/.test(line))  

  const level =
    hasError ? 'error' :
    hasWarning ? 'warning' :
    hasDebug ? 'debug' : 'info'

  const startLine = lines.find(line => /^START:/.test(line))
  const stopLine  = lines.find(line => /^STOP :/.test(line))

  const start = startLine ? extractTimestamp(startLine) : ''
  const stop  = stopLine ? extractTimestamp(stopLine) : ''

  const elapsedTime = start && stop ?  getElapsedTime(stop, start) : undefined

  return {
      type:        'startup'
    , index:       i
    , process:     'start/stop'
    , name:        'start/stop'
    , inProgress:  false
    , start:       start
    , stop:        stop
    , elapsedTime: elapsedTime
    , lines:       lines.map(parseLine)
    , hasError:    hasError
    , hasWarning:  hasWarning
    , hasDebug:    hasDebug
    , hasInfo:     hasInfo
    , level:       level
  }
}



function parseLine(line) {
  const m = line.match(/^(\w+) ?: (?:(\d\d:\d\d:\d\d\.\d{3}) )?(.*)/) || {}
  return {
    level:   m[1] || '',
    time:    m[2] || '',
    content: m[3] || line
  }
}

function extractTimestamp(line) {
  const m = line.match(/\d{2}:\d{2}:\d{2}(\.\d{3})?/)
  return m ? m[0] : ''
}
