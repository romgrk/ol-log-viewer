import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    setFile
  , setLogDensity
  , unfoldAll
  , foldAll
  , toggleSidebarVisibility
} from '../actions'
import { LOG_DENSITY } from '../constants';
import SearchBox from './SearchBox';
import ProcessList from './ProcessList';
import DropZone from './DropZone';
import LevelFilters from './LevelFilters';
import LogContainer from './LogContainer';
import Select from './Select';
import FileSelect from './FileSelect';
import ServiceList from './ServiceList';
import Icon from './Icon';

const mapStateToProps = state => ({
    file:             state.file
  , logs:             state.logs
  , filters:          state.filters
  , services:         state.services
  , logDensity:       state.ui.logDensity
  , isSidebarVisible: window.IS_ELECTRON && state.ui.sidebar
})
const mapDispatchToProps = dispatch => ({
    setLogDensity: value => dispatch(setLogDensity(value))
  , onChangeFile:  file => dispatch(setFile(file))
  , dispatch
})


const densities = [
    { label: 'Small',  value: LOG_DENSITY.SMALL }
  , { label: 'Medium', value: LOG_DENSITY.MEDIUM }
  , { label: 'Large',  value: LOG_DENSITY.LARGE }
]

class App extends Component {
  constructor(props) {
    super(props)
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onDocumentKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  }

  onDocumentKeyDown(event) {
    if (event.altKey && event.key === '1') {
      event.preventDefault()
      this.dispatch(toggleSidebarVisibility())
    }
  }

  render() {
    const {
        dispatch
      , file
      , logs
      , filters
      , services
      , logDensity
      , isSidebarVisible
      , setLogDensity
      , onChangeFile
    } = this.props

    this.dispatch = dispatch

    const visibleLogs = getVisibleLogs(filters, logs)

    const isFileLoaded = Boolean(file.name)

    return (
      <div className='App'>
        { isSidebarVisible &&
            <div className='App-sidebar sidebar'>
              <ServiceList/>
            </div>
        }
        <div className='App-view'>

          <div className='App-filters navbar-default'>
            <div className='row'>
              <div className='col-xs-2'>
                <ProcessList/>
              </div>
              <div className='col-xs-2'>
                <SearchBox/>
              </div>
              <div className='col-xs-5'>
                <LevelFilters/>
              </div>
              <div className='col-xs-2'>
                <div className='btn-group'>
                  <button className='btn btn-default' onClick={() => dispatch(unfoldAll())}>
                    <i className='fa fa-plus'/>
                  </button>
                  <button className='btn btn-default' onClick={() => dispatch(foldAll())}>
                    <i className='fa fa-minus'/>
                  </button>
                </div>
              </div>
              <div className='col-xs-1'>
                <Select options={densities} value={logDensity} onChange={value => setLogDensity(value)}>
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

          <div className='App-content'>
            { !isFileLoaded &&
              <div className='App-file-select'>
                <div>
                  <FileSelect onChange={onChangeFile} label='Select'/> or Drop file
                </div>
              </div>
            }
            { isFileLoaded && <LogContainer logs={visibleLogs} /> }
          </div>
        </div>

        <DropZone file={file.name} onChange={onChangeFile}/>
      </div>
    );
  }
}

function getVisibleLogs(filters, logs) {
  const visibleProcesses =
    Object.keys(filters.processes).filter(n => filters.processes[n])

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
