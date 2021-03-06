import React, { Component } from 'react';
import cx from 'classname';

class Select extends Component {
  constructor(props) {
    super(props)
    this.onDocumentClick = this.onDocumentClick.bind(this)
    this.onClick = this.onClick.bind(this)
    this.state = {
      visible: false
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
  }

  onDocumentClick(event) {
    if (this.state.visible
        && event.target !== this.refs.button
        && !this.refs.button.contains(event.target))
      this.setState({ visible: false })
  }

  onClick(event) {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { value, options, onChange, children, size } = this.props
    const { visible } = this.state

    const btnClassName =
      'Select-button btn btn-default' + (size ? ` btn-${size}` : '')

    return (
      <div
        ref='container'
        className={cx('Select dropdown', { open: visible })}
      >
        <button
          ref='button'
          type='button'
          className={btnClassName}
          onClick={this.onClick}
        >
          { children || value }
        </button>
        <div
          ref='list'
          className='Select-list dropdown-menu dropdown-menu-right'
        >
          { options.map(d =>
              <button
                key={d.value}
                type='button'
                className={cx('list-group-item', { active: value === d.value })}
                onClick={() => onChange(d.value)}
              >
                { d.label }
              </button>
          )}
        </div>
      </div>
    )
  }
}

export default Select;
