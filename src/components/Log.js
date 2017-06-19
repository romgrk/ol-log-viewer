import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';
import Highlighter from 'react-highlight-words';

import { LOG_DENSITY } from '../constants';
import {
  renderElapsedTime
} from '../utils';
import {
    setLogFolded
  , setLogShowAll
} from '../actions';

const mapStateToProps = state => ({
  searchTerms: state.filters.searchTerms,
  density: state.ui.logDensity
})
const mapDispatchToProps = dispatch => ({
    setLogFolded: (index, folded) => dispatch(setLogFolded(index, folded))
  , setLogShowAll: (index, showAll) => dispatch(setLogShowAll(index, showAll))
})

const levelsTrClassNames = {
  INFO:  '',
  DEBUG: '',
  WARN:  'bg-warning',
  ERROR: 'bg-danger',
}

const levelsTdClassNames = {
  INFO:  '',
  DEBUG: '',
  WARN:  '',
  ERROR: '',
}

const MAX_LINES = 10

class Log extends Component {
  render() {
    const {
        density
      , data
      , searchTerms
      , setLogFolded
      , setLogShowAll
    } = this.props
    const showAll  = data.showAll
    const isFolded = data.folded

    const visibleLines =
      showAll ? data.lines : data.lines.slice(0, MAX_LINES)

    const isCropped = !showAll && data.lines.length > MAX_LINES

    const linesCount       = data.lines.length
    const hiddenLinesCount = data.lines.length - visibleLines.length

    const isProcessLog = data.type === 'process'

    const className = cx(
      'Log panel', {
        'panel-collapsed': isFolded,
        'panel-default':  !data.hasError,
        'panel-danger':    data.hasError,
        'panel-info':     !isProcessLog,
      }
    )

    const tableClassName = cx(
      'table table-logs', {
        'hidden':        isFolded,
        'slide--show':  !isFolded,
        'slide--hide':   isFolded,
        'table--small':  density === LOG_DENSITY.SMALL,
        'table--medium': density === LOG_DENSITY.MEDIUM,
        'table--large':  density === LOG_DENSITY.LARGE
      }
    )

    const hasElapsedTimeWarning = data.ratio > 1.2
    const elapsedTimeClassName = cx(
      'glyphicon glyphicon-warning-sign', {
        'text-hl-warning': data.ratio <  1.99,
        'text-hl-danger':  data.ratio >= 1.99,
      }
    )

    return (
      <div className={className}>

        <div
            className='panel-heading clickable'
            onClick={() => setLogFolded(data.index, !isFolded)}
          >
          { isProcessLog &&
            <span>
              { data.start.replace(/\.\d{3}/, '') } <b>{ data.name }</b>&nbsp;
              <span
                  className='label label-default no-select'
                  title={
                    data.ratio === undefined ? '' :
                    `This process ran at a ratio of ${data.ratio.toFixed(2)} of the average.`}>
                { renderElapsedTime(data.elapsedTime)
                } { hasElapsedTimeWarning &&
                    <i className={elapsedTimeClassName} /> }
              </span>
            </span>
          }
          { !isProcessLog &&
              <span>
                { data.stop &&
                  <span>
                    { data.stop } <i><b>Stop</b></i>
                  </span>
                }
                { (data.start && data.stop) && <span> — </span> }
                { data.start &&
                  <span>
                    { data.start } <i><b>Start</b></i>
                  </span>
                }
                { (data.start && data.stop) &&
                    <span>
                      &nbsp;&nbsp;&nbsp;&nbsp;(elapsed: { renderElapsedTime(data.elapsedTime) })
                    </span>
                }
              </span>
          }

          { isFolded &&
            <span className='pull-right text-muted'>{ linesCount } lines</span>
          }
        </div>

        <div className='table-responsive'>
          <table className={tableClassName}>
            <tbody>
              { visibleLines.map((line, i) =>
                  <tr key={i} className={ levelsTrClassNames[line.level] || '' }>
                    <td className='td-time small no-select text-muted'>{ line.time || <i>&nbsp;</i> }</td>
                    <td className={ levelsTdClassNames[line.level] || '' }>
                      <Highlighter
                        highlightClassName='highlight'
                        searchWords={searchTerms}
                        textToHighlight={ line.content }
                      />
                    </td>
                  </tr>
              ) }
              { isCropped &&
                <tr className='Log-show-all border-top'>
                  <td
                      className='no-select'
                      colSpan='2'
                      onClick={() => setLogShowAll(data.index, !showAll)}>
                    Show all ({hiddenLinesCount} lines not shown)
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Log);
