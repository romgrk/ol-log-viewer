import React, { Component } from 'react';
import cx from 'classname';

import Log from './Log';

class LogContainer extends Component {
  constructor(props) {
    super(props)
  }

  componentWillUpdate() {
    var node = this.refs.container
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight >= (node.scrollHeight - 50)
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      var node = this.refs.container
      node.lastChild.scrollIntoView()
    }
  }

  render() {
    const { logs } = this.props

    return (
      <div ref='container' className='LogContainer' >
        { logs.length === 0 &&
          <div className='LogContainer-empty'>No visible logs</div>
        }
        { logs.map(log =>
          <Log key={log.index} data={log} />
        )}
      </div>
    )
  }
}

export default LogContainer;
