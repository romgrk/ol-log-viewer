import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setProcessVisibility } from '../actions'
import MultiSelect from './MultiSelect';

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
      <MultiSelect
        values={processes}
        onChangeValue={(process, value) => dispatch(setProcessVisibility(process, value))}/>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessList);
