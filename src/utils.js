/*
 * utils.js
 */

const fs = window.require('fs')
const { join } = window.require('path')

export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsText(file)
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

