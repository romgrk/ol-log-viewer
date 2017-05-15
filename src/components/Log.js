import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';
import Highlighter from 'react-highlight-words';

import { LOG_DENSITY } from '../constants';

const mapStateToProps = state => ({
  searchTerms: state.filters.searchTerms,
  density: state.ui.logDensity
})
const mapDispatchToProps = dispatch => ({
})

const levelsTrClassNames = {
  INFO:  '',
  DEBUG: '',
  WARN:  '',
  ERROR: 'bg-danger',
}

const levelsTdClassNames = {
  INFO:  '',
  DEBUG: '',
  WARN:  'text-warning',
  ERROR: '',
}

const MAX_LINES = 10

class Log extends Component {
  constructor(props) {
    super(props)
    this.setFolded = this.setFolded.bind(this)
    this.setShowAll = this.setShowAll.bind(this)
    this.state = {
      folded: false,
      showAll: false
    }
  }

  setFolded(value) {
    this.setState({ folded: value })
    if (value === true)
      this.setShowAll(false)
  }

  setShowAll(value) {
    this.setState({ showAll: value })
  }

  render() {
    const {
        dispatch
      , density
      , data
      , searchTerms
      , folded
    } = this.props
    const { showAll } = this.state
    const isFolded = folded !== undefined ? folded : this.state.folded

    const visibleLines =
      showAll ? data.lines : data.lines.slice(0, MAX_LINES)

    const isCropped = !showAll && data.lines.length > MAX_LINES

    const hiddenLinesCount = data.lines.length - visibleLines.length


    const className = cx(
      'Log panel', {
        'panel-collapsed': isFolded,
        'panel-danger':    data.hasError,
        'panel-default':  !data.hasError
      }
    )

    const tableClassName = cx(
      'table table-logs', {
        'slide--show':  !isFolded,
        'slide--hide':   isFolded,
        'table--small':  density === LOG_DENSITY.SMALL,
        'table--medium': density === LOG_DENSITY.MEDIUM,
        'table--large':  density === LOG_DENSITY.LARGE
      }
    )

    return (
      <div className={className}>

        <div
            className='panel-heading clickable'
            onClick={() => this.setFolded(!isFolded)}
          >
          { data.start.replace(/\.\d{3}/, '') } <b>{ data.name }</b>&nbsp;
          <span className="label label-default">{ renderTime(data.elapsedTime) }</span>
        </div>

        <table className={tableClassName}>
          <tbody>
            { visibleLines.map(line =>
                <tr className={ levelsTrClassNames[line.level] || '' }>
                  <td className='small'>{ line.time || '' }</td>
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
              <tr className='Log-show-all'>
                <td colSpan='2' onClick={() => this.setShowAll(true)}>
                  Show all ({hiddenLinesCount} lines not shown)
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    )
  }
}

function renderTime(time) {
  if (time == undefined)
    return '...'

  const m = time.match(/(\d{2}):(\d{2}):(\d{2}):(\d{3})/)
  const hours        = +m[1]
  const minutes      = +m[2]
  const seconds      = +m[3]
  const milliseconds = +m[4]

  if (hours > 0)
    return `${hours}h ${minutes}m`

  if (minutes > 0)
    return `${minutes}m ${seconds}s`

  if (seconds > 0)
    return `${seconds}.${milliseconds}s`

  return `${seconds}.${milliseconds}s`
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Log);
