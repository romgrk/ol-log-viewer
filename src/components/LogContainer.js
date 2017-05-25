import React, { Component } from 'react';

import Log from './Log';

class LogContainer extends Component {
  componentWillUpdate() {
    const node = this.refs.container
    const scrollTop = node.scrollTop + node.offsetHeight
    const scrollHeight = node.scrollHeight
    this.shouldScrollBottom = scrollTop >= scrollHeight
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      const node = this.refs.container
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
