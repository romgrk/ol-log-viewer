/*
 * parsers.js
 */


export function parseLogFile(content) {
  const reports = content.split(/^-+$/m).slice(1)

  return reports.map((report, i) => {

    const lines = report.split('\r\n').filter(line => !/^\s*$/.test(line))

    const firstIndex = lines.findIndex(isProcLine)
    const firstProcLine = lines[firstIndex]

    lines.splice(0, firstIndex + 1)

    const lastIndex = lines.findIndex(isProcLine)
    const lastProcLine = lines[lastIndex]

    const inProgress = lastIndex === -1

    if (!inProgress)
      lines.splice(lastIndex)

    const hasError = lines.some((line) => /^ERROR/.test(line)) 
    const hasWarning = lines.some((line) => /^WARN/.test(line))  
    const hasDebug = lines.some((line) => /^DEBUG/.test(line)) 
    const hasInfo = lines.some((line) => /^INFO/.test(line))  

    const level =
      hasError ? 'error' :
      hasWarning ? 'warning' :
      hasDebug ? 'debug' : 'info'

    const name    = report.match(/WPROC: (.*(?= \(thread id: ))/)[1]
    const process = name.replace(/_[0-9A-Z]{15}$/, '')

    return {
        index:       i
      , process:     process
      , name:        name
      , inProgress:  inProgress
      , start:       extractTimestamp(firstProcLine)
      , elapsedTime: !inProgress ? extractElapsedTime(lastProcLine) : undefined
      , lines:       lines.map(parseLine)
      , hasError:    hasError
      , hasWarning:  hasWarning
      , hasDebug:    hasDebug
      , hasInfo:     hasInfo
      , level:       level
    }
  })
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

function extractElapsedTime(line) {
  const m = line.match(/\(elapsed time: (\d{2}:\d{2}:\d{2}:\d{3})\)/)
  return m ? m[1] : ''
}

function isProcLine(line) {
  return /^WPROC/.test(line)
}
