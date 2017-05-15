import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';

import {
    setFile
  , setLogDensity
} from '../actions'
import { LOG_DENSITY } from '../constants';
import SearchBox from './SearchBox';
import ProcessList from './ProcessList';
import DropZone from './DropZone';
import LevelFilters from './LevelFilters';
import LogContainer from './LogContainer';
import Select from './Select';

const mapStateToProps = state => ({
    file: state.file
  , logs: state.logs
  , filters: state.filters
  , logDensity: state.ui.logDensity
})
const mapDispatchToProps = dispatch => ({
  dispatch
  , setLogDensity: value =>
    dispatch(setLogDensity(value))
  , onChangeFile: file =>
    dispatch(setFile(file))
})

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
        dispatch
      , file
      , logs
      , filters
      , logDensity
      , setLogDensity
      , onChangeFile
    } = this.props

    const visibleLogs = getVisibleLogs(filters, logs)

    const densities = [
        { label: 'Small',  value: LOG_DENSITY.SMALL }
      , { label: 'Medium', value: LOG_DENSITY.MEDIUM }
      , { label: 'Large',  value: LOG_DENSITY.LARGE }
    ]
      
    return (
      <div className="App">
        <div className="App-header">
          <DropZone file={file.name} onChange={onChangeFile}/>
        </div>

        <div className='App-filters'>
          <div className='row'>
            <div className='col-xs-3'>
              <ProcessList/>
            </div>
            <div className='col-xs-2'>
              <SearchBox/>
            </div>
            <div className='col-xs-6'>
              <LevelFilters/>
            </div>
            <div className='col-xs-1'>
              <Select data={densities} value={logDensity} onChange={value => setLogDensity(value)}>
                <i className='fa fa-th'/>
              </Select>
            </div>
          </div>
          <br/>
          <div className='row'>
            <div className='col-xs-8'>
              Results: <b>{ visibleLogs.length }</b> (<b>{ logs.length}</b> total)
            </div>
            <div className='col-xs-4'>
            </div>
          </div>
          <br/>
        </div>

        <div className="App-content">
          <LogContainer logs={visibleLogs} />
        </div>
      </div>
    );
  }
}

function getVisibleLogs(filters, logs) {
  const visibleProcesses = Object.keys(filters.processes).filter(n => filters.processes[n])

  return logs.filter(log => {
    if (!visibleProcesses.includes(log.process))
      return false

    if (!filters.levels[log.level])
      return false

    if (filters.searchTerms.length > 0
        && !log.lines.some(line =>
            filters.searchTerms.some(term =>
              line.content.includes(term))))
      return false

    return true
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
