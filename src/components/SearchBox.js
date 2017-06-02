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
    this.onKeyDown = this.onKeyDown.bind(this)
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
      event.preventDefault()
      this.refs.input.focus()
    }
  }

  onKeyDown(event) {
    if (event.key === 'Escape') {
      this.props.dispatch(setSearch(''))
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
          onKeyDown={this.onKeyDown}
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
