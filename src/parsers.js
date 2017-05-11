/*
 * parsers.js
 */


export function parseLogFile(content) {
  const reports = content.split(/^-+$/m).slice(1)

  return reports.map((report, i) => {

    const lines = report.split('\r\n')

    const firstIndex = lines.findIndex(isProcLine)
    const firstProcLine = lines[firstIndex]

    lines.splice(0, firstIndex + 1)

    const lastIndex = lines.findIndex(isProcLine)
    const lastProcLine = lines[lastIndex]

    lines.splice(lastIndex)

    return {
      index:       i,
      process:     report.match(/WPROC: (\w+)/)[1],
      start:       extractTimestamp(firstProcLine),
      elapsedTime: extractElapsedTime(lastProcLine),
      lines:       lines.map(parseLine),
      hasError:    lines.some((line) => /^ERROR/.test(line))
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
