/*
 * models.js
 */

import {
    LOG_DENSITY
  , SERVICES
} from './constants';

export function createDefaultUI() {
  return {
    logDensity: LOG_DENSITY.SMALL,
    lastFoldedIndex: 0,
    lastFoldedTimestamp: undefined,
    lastScrollBottom: undefined,
    lastScrollTop: undefined,
  }
}

export function createDefaultServices() {
  return SERVICES.map(service => ({
    ...service,
    state: { code: undefined, description: '' },
    isRunning: false,
    isStarting: false,
    isStopping: false,
    isUpdating: false
  }))
}

export function createDefaultFilters() {
  return {
      searchValue: ''
    , searchTerms: []
    , processes: {}
    , levels: { error: true, warning: true, debug: true, info: true }
  }
}
