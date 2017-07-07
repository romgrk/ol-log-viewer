import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    scrollBottom
  , scrollTop
} from '../actions'

const mapStateToProps = state => ({
})
const mapDispatchToProps = dispatch => ({
  onScrollBottom: () => dispatch(scrollBottom()),
  onScrollTop:    () => dispatch(scrollTop())
})

class FoldButtons extends Component {
  render() {
    const { onScrollBottom, onScrollTop } = this.props

    return (
      <div className='ScrollButtons btn-group'>
        <button className='btn btn-default' onClick={onScrollTop}>
          <i className='fa fa-chevron-up'/>
        </button>
        <button className='btn btn-default' onClick={onScrollBottom}>
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
