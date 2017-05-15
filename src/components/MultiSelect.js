import React, { Component } from 'react';
import cx from 'classname';

class MultiSelect extends Component {
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
        && event.target !== this.refs.list
        && !this.refs.button.contains(event.target)
        && !this.refs.list.contains(event.target))
      this.setState({ visible: false })
  }

  onClick(event) {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { values, onChangeValue } = this.props
    const { visible } = this.state

    const checkedValues = Object.keys(values).filter(v => values[v])

    return (
      <div
        ref='container'
        className={cx('MultiSelect dropdown', { open: visible })}
      >
        <div
          ref='button'
          className='MultiSelect-button btn btn-default'
          onClick={this.onClick}
        >
          <span>
            { checkedValues.join(', ') || 'No value selected' }
          </span>
          <i className='glyphicon glyphicon-chevron-down' />
        </div>
        <div
          ref='list'
          className='MultiSelect-list dropdown-menu'
        >
          { Object.keys(values).map(value =>
              <button
                type="button"
                className={cx('list-group-item')}
                onClick={() => onChangeValue(value, !values[value])}
              >
                <i
                  style={{ width: '2ch' }}
                  className={values[value] ? 'fa fa-check-square-o' : 'fa fa-square-o'}
                />&nbsp;
                { value }
              </button>
          )}
        </div>
      </div>
    )
  }
}

export default MultiSelect;
