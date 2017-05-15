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
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onDocumentKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onDocumentKeyDown)
  }

  onDocumentKeyDown(event) {
    if (event.ctrlKey && event.key === 'f') {
      this.refs.input.focus()
    }
  }

  render() {
    const { dispatch, searchValue } = this.props

    return (
      <div className='SearchBox'>
        <input
          type='text'
          ref='input'
          className='form-control'
          placeholder='Search for...'
          value={searchValue}
          onChange={ev => dispatch(setSearch(ev.target.value))}
        />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBox);
