import React, { Component } from 'react';

class Icon extends Component {
  render() {
    const {
        name
      , hl
      , spin
    } = this.props

    const className =
      `fa fa-${name}`
      + (hl ? ` text-hl-${hl}` : '' )
      + (spin ? ' fa-spin' : '')

    return (
      <i
        className={className}
      ></i>
    )
  }
}

export default Icon;
