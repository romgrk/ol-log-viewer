import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import Log from './Log';


const mapStateToProps = state => ({
    lastFoldedIndex:     state.ui.lastFoldedIndex
  , lastFoldedTimestamp: state.ui.lastFoldedTimestamp
  , lastScrollBottom:    state.ui.lastScrollBottom
})

class LogContainer extends Component {
  constructor(props) {
    super(props)

    this.lastFoldedTimestamp = this.props.lastFoldedTimestamp

    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: (67 + 12) + 10 * 24
    })

    this.renderEmpty = this.renderEmpty.bind(this)
    this.renderRow   = this.renderRow.bind(this)
  }

  scrollBottom() {
    setImmediate(() => {
      this.list.scrollToRow(this.props.logs.length)

      const node = this.list.Grid._scrollingContainer
      node.scrollTop = node.scrollHeight + node.offsetHeight
    })
  }

  componentWillUpdate() {
    const node = this.list.Grid._scrollingContainer
    const scrollTop    = node.scrollTop + node.offsetHeight + 50
    const scrollHeight = node.scrollHeight

    this.shouldScrollBottom = scrollTop >= scrollHeight
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      this.scrollBottom()
    }
    this.updateRowHeights()
  }

  componentDidReceiveProps() {
    this.updateRowHeights()
  }

  updateRowHeights() {
    if (this.lastFoldedTimestamp !== this.props.lastFoldedTimestamp) {
      this.lastFoldedTimestamp = this.props.lastFoldedTimestamp

      if (this.props.lastFoldedIndex === -1)
        this.cache.clearAll()
      else
        this.cache.clear(this.props.lastFoldedIndex, 0)

      this.list.recomputeRowHeights(this.props.lastFoldedIndex === -1 ? 0 : this.props.lastFoldedIndex)
      this.list.forceUpdateGrid()
    }
  }

  renderRow({ index, parent, isScrolling, key, style }) {
    return (
      <CellMeasurer
          cache={this.cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
          key={key}>
        <div style={style}>
          <Log data={this.props.logs[index]} />
        </div>
      </CellMeasurer>
    )
  }

  renderEmpty() {
    return (
      <div className='LogContainer-empty'>No visible logs</div>
    )
  }

  render() {
    const { logs } = this.props

    window.list = this.list

    if (this.lastScrollBottom !== this.props.lastScrollBottom) {
      this.lastScrollBottom = this.props.lastScrollBottom
      this.scrollBottom()
    }

    return (
      <AutoSizer ref='container'>
      {
        ({width, height}) => (
          <List className='LogContainer'
            ref={(ref) =>  this.list = ref }
            height={height}
            width={width}
            overscanRowCount={10}
            rowCount={logs.length}
            rowHeight={this.cache.rowHeight}
            noRowsRenderer={this.renderEmpty}
            rowRenderer={this.renderRow}
          />
        )
      }
      </AutoSizer>
    )
  }
}

export default connect(mapStateToProps)(LogContainer);
