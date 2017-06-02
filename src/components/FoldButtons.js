import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    unfoldAll
  , foldAll
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
      <div className='FoldButtons btn-group'>
        <button className='btn btn-default' onClick={() => dispatch(unfoldAll())}>
          <i className='fa fa-plus'/>
        </button>
        <button className='btn btn-default' onClick={() => dispatch(foldAll())}>
          <i className='fa fa-minus'/>
        </button>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoldButtons);
