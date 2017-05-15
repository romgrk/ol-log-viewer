/*
 * models.js
 */

import { LOG_DENSITY } from './constants';

export function createDefaultUI() {
  return {
    logDensity: LOG_DENSITY.SMALL
  }
}

export function createDefaultFilters() {
  return {
      searchValue: ''
    , searchTerms: []
    , processes: {}
    , levels: { error: true, warning: true, debug: true, info: true }
  }
}
