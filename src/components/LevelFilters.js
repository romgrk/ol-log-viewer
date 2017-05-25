import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';

import { setLevelVisibility } from '../actions'

const mapStateToProps = state => ({
  levels: state.filters.levels
})
const mapDispatchToProps = dispatch => ({
  dispatch
})

const levelClassNames = {
    error: 'btn-danger'
  , warning: 'btn-warning'
  , debug: 'btn-info'
  , info: ''
}

class LevelFilters extends Component {
  render() {
    const { dispatch, levels } = this.props

    return (
      <div className='LevelFilters btn-group'>
        { Object.keys(levels).map(level =>
            <button
              key={level}
              type="button"
              className={cx('btn btn-default', levelClassNames[level], { active: levels[level] })}
              onClick={() => dispatch(setLevelVisibility(level, !levels[level]))}
            >
              <i
                style={{ width: '2ch' }}
                className={levels[level] ? 'fa fa-check-square-o' : 'fa fa-square-o'}
              />&nbsp;
              { level }
            </button>
        )}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LevelFilters);
