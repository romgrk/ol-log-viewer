import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';
import Highlighter from 'react-highlight-words';

const mapStateToProps = state => ({
  searchTerms: state.filters.searchTerms
})
const mapDispatchToProps = dispatch => ({
})

const LEVELS = {
  INFO:  '',
  DEBUG: 'bg-info',
  WARN:  'bg-warning',
  ERROR: 'bg-danger',
}

const Log = ({ dispatch, data, searchTerms }) => {
  return (
    <div className={cx('panel', data.hasError ? 'panel-danger' : 'panel-default')}>
      <div className='panel-heading'>
        <span className='badge'>{data.index}</span>&nbsp;
        { data.start.replace(/\.\d{3}/, '') } <b>{ data.process }</b>&nbsp;
        <span className="label label-default">{ renderTime(data.elapsedTime) }</span>
      </div>
      <table className="table table-logs">
        <tbody>
          { data.lines.map(line =>
              <tr className={ LEVELS[line.level] || '' }>
                <td className='small'>{ line.time || '' }</td>
                <td className=''>
                  <Highlighter
                    highlightClassName='highlight'
                    searchWords={searchTerms}
                    textToHighlight={ line.content }
                  />
                </td>
              </tr>
          ) }
        </tbody>
      </table>
    </div>
  )
}

function renderTime(time) {
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
