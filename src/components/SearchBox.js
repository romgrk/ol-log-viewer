import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setSearch } from '../actions'

const mapStateToProps = state => ({
  searchValue: state.filters.searchValue
})
const mapDispatchToProps = dispatch => ({
  dispatch
})

class SearchBox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { dispatch, searchValue } = this.props

    return (
      <div className='SearchBox input-group'>
        <input
          type='text'
          ref='input'
          className='form-control'
          placeholder='Search for...'
          value={searchValue}
          onChange={ev => dispatch(setSearch(ev.target.value))}
        />
        <span className='input-group-btn'>
          <button className='btn btn-default'>
            Clear
          </button>
        </span>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBox);
