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
    const { value, data, onChange, children } = this.props
    const { visible } = this.state

    return (
      <div
        ref='container'
        className={cx('Select dropdown', { open: visible })}
      >
        <div
          ref='button'
          className='Select-button btn btn-default'
          onClick={this.onClick}
        >
          { children || value }
        </div>
        <div
          ref='list'
          className='Select-list dropdown-menu dropdown-menu-right'
        >
          { data.map(d =>
              <button
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
