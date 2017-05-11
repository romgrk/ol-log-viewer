/*
 * polyfills.js
 */

Array.prototype.includes = function(value) {
  return this.some(element => element === value)
}
