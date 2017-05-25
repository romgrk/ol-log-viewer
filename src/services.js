/*
 * services.js
 */


const { exec } = window.require('child_process')


const state_pattern = /STATE\s+:\s+(\d+)\s+(\w+)/
const pid_pattern   = /PID\s+:\s+(\d+)/


export function getState(name) {
  return new Promise((resolve, reject) => {
    exec(`sc queryex ${name}`, (err, stdout, stderr) => {
      if (err)
        return reject(err)

      if (stderr)
        return reject(stderr)

      const stateMatches = stdout.match(state_pattern)
      const pidMatches   = stdout.match(pid_pattern)

      if (stateMatches === null)
        return reject(`Couldnt match state in: ${stdout}`)

      if (pidMatches === null)
        return reject(`Couldnt match PID in: ${stdout}`)

      resolve({
        state:       stateMatches[1],
        description: stateMatches[2],
        pid:         pidMatches[1]
      })
    })
  })
}

export function start(name) {
  return new Promise((resolve, reject) => {
    exec(`sc start ${name}`, (err, stdout, stderr) => {
      if (err)
        return reject(err)

      if (stderr)
        return reject(stderr)

      resolve(stdout)
    })
  })
}

export function stop(name) {
  return new Promise((resolve, reject) => {
    exec(`sc stop ${name}`, (err, stdout, stderr) => {
      if (err)
        return reject(err)

      if (stderr)
        return reject(stderr)

      resolve(stdout)
    })
  })
}

export function kill(pid) {
  return new Promise((resolve, reject) => {
    exec(`taskkill /f /pid ${pid}`, (err, stdout, stderr) => {
      if (err)
        return reject(err)

      if (stderr)
        return reject(stderr)

      resolve(stdout)
    })
  })
}


