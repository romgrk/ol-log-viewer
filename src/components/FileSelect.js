import React, { Component } from 'react';

class FileSelect extends Component {
  constructor(props) {
    super(props)
    this.onChange    = this.onChange.bind(this)
  }

  onChange(event) {
    const files = event.target.files
    if (files.length && this.props.onChange)
      this.props.onChange(files[0])
  }

  render() {
    const { label } = this.props

    return (
      <div className='FileSelect' >
        <a onClick={() => this.refs.input.click()}>{ label }</a>
        <input
          className='FileSelect-input'
          type='file'
          ref='input'
          onChange={this.onChange} />
      </div>
    );
  }
}

export default FileSelect;
