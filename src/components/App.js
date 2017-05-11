import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setFile } from '../actions'
import SearchBox from './SearchBox';
import ProcessList from './ProcessList';
import DropZone from './DropZone';
import Log from './Log';

const mapStateToProps = state => ({
  file: state.file,
  logs: state.logs,
  filters: state.filters
})
const mapDispatchToProps = dispatch => ({
  dispatch
})

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { dispatch, file, logs, filters } = this.props

    const onChangeFile = file =>
      dispatch(setFile(file))

    const visibleLogs = getVisibleLogs(filters, logs)

    return (
      <div className="App">
        <div className="App-header">
          <h2>Log Viewer</h2>
          <small>{ file ? file.name : 'No file loaded' }</small>
        </div>
        <br/>

        <div className='App-drop-zone container'>
          { !file.name && <DropZone onChange={onChangeFile}/> }
        </div>
        <br/>

        <div className='App-filters container'>
          <div className='row'>
            <div className='col-xs-12'>
              <ProcessList/>
            </div>
          </div>
          <br/>
          <div className='row'>
            <div className='col-xs-12'>
              <SearchBox/>
            </div>
          </div>
          <br/>
          <div className='row'>
            <div className='col-xs-12'>
              Results: <b>{ visibleLogs.length }</b>
            </div>
          </div>
        </div>
        <br/>

        <div className="App-content container">
          <div className='row'>
            <div className='col-xs-12'>
              { visibleLogs.length === 0 && 
                <div className='App-no-logs'>No visible logs</div>
              }
              { visibleLogs.map(log =>
                <Log key={log.index} data={log} />
              )}
            </div>
          </div>
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
