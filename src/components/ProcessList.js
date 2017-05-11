import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';

import { setProcessVisibility } from '../actions'

const mapStateToProps = state => ({
  processes: state.filters.processes
})
const mapDispatchToProps = dispatch => ({
  dispatch
})

class ProcessList extends Component {
  render() {
    const { dispatch, processes } = this.props

    return (
      <div className='ProcessList btn-group'>
        { Object.keys(processes).map(name =>
            <button
              type="button"
              className={cx('btn btn-default', { active: processes[name] })}
              onClick={() => dispatch(setProcessVisibility(name, !processes[name]))}
            >
              { name }
            </button>
        )}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessList);
