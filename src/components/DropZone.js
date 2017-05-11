import React, { Component } from 'react';
import { connect } from 'react-redux';
import cx from 'classname';

//import './DropZone.css';


class DropZone extends Component {
  constructor(props) {
    super(props)
    this.onChange    = this.onChange.bind(this)
    this.onDrag      = this.onDrag.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd   = this.onDragEnd.bind(this)
    this.onDragOver  = this.onDragOver.bind(this)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop      = this.onDrop.bind(this)

    this.state = {
      over: false
    }
  }

  setDragOver(value) {
    this.setState({ over: value })
  }

  onDrag(event) {
    event.preventDefault()
    event.stopPropagation()
  }
  onDragStart(event) {
    event.preventDefault()
    event.stopPropagation()
  }
  onDragOver(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(true)
  }
  onDragEnter(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(true)
  }
  onDragEnd(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(false)
  }
  onDragLeave(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(false)
  }
  onDrop(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setDragOver(false)

    if (this.props.onChange)
      this.props.onChange(event.dataTransfer.items[0].getAsFile())
  }

  onChange(event) {
    const files = event.target.files
    if (files.length && this.props.onChange)
      this.props.onChange(files[0])
  }


  render() {
    return (
      <div
        className={cx('DropZone', { 'is-drag-over': this.state.over })}
        onChange={this.onChange}
        onDrag={this.onDrag}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
      >
        <div>
          <h3>
            <a onClick={() => this.refs.input.click()}>Select file</a> or Drop file
          </h3>
          <input
            className='DropZone-input'
            type='file'
            ref='input'
            onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default DropZone;
