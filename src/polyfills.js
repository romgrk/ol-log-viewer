/*
 * polyfills.js
 */


window.IS_ELECTRON = window.process ? true : false

if (!window.IS_ELECTRON)
  window.require = () => ({})


/* eslint-disable no-extend-native */
Array.prototype.includes = function(value) {
  return this.some(element => element === value)
}
/* eslint-enable no-extend-native */

