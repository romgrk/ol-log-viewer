import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';

import {
    scrollBottom
  , scrollTop
} from '../actions'

const mapStateToProps = state => ({
  hasNewLogs: state.ui.hasNewLogs
})
const mapDispatchToProps = dispatch => ({
  onScrollBottom: () => dispatch(scrollBottom()),
  onScrollTop:    () => dispatch(scrollTop())
})

class FoldButtons extends Component {
  render() {
    const {
        onScrollBottom
      , onScrollTop
      , hasNewLogs
    } = this.props

    const scrollBottomCx = cx('btn btn-default', { 'btn-blinking': hasNewLogs })

    return (
      <div className='ScrollButtons btn-group'>
        <button className='btn btn-default' onClick={onScrollTop}>
          <i className='fa fa-chevron-up'/>
        </button>
        <button className={scrollBottomCx} onClick={onScrollBottom}>
          <i className='fa fa-chevron-down'/>
        </button>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoldButtons);
