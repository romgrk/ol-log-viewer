import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  scrollBottom
} from '../actions'

const mapStateToProps = state => ({
})
const mapDispatchToProps = dispatch => ({
  dispatch
})

class FoldButtons extends Component {
  render() {
    const { dispatch } = this.props

    return (
      <div className='ScrollButtons btn-group'>
        <button className='btn btn-default' onClick={() => dispatch(scrollBottom())}>
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
