import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import Log from './Log';


const mapStateToProps = state => ({
    lastFoldedIndex:     state.ui.lastFoldedIndex
  , lastFoldedTimestamp: state.ui.lastFoldedTimestamp
})

class LogContainer extends Component {
  constructor(props) {
    super(props)

    this.lastFoldedTimestamp = this.props.lastFoldedTimestamp

    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: (67 + 12) + 10 * 24
    })
    console.log(this.cache)

    this.renderRow = this.renderRow.bind(this)
    this.getRowHeight = this.getRowHeight.bind(this)
  }

  componentWillUpdate() {
    //const node = this.refs.container
    const node = this.list.Grid._scrollingContainer
    const scrollTop = node.scrollTop + node.offsetHeight
    const scrollHeight = node.scrollHeight
    this.shouldScrollBottom = scrollTop >= scrollHeight
    //debugger
    this.updateRowHeights()
  }

  componentDidUpdate() {
    if (this.shouldScrollBottom) {
      this.list.scrollToRow(this.props.logs.length)
    }
    this.updateRowHeights()
  }

  componentDidReceiveProps() {
    this.updateRowHeights()
  }

  updateRowHeights() {
    if (this.lastFoldedTimestamp !== this.props.lastFoldedTimestamp) {
      this.lastFoldedTimestamp = this.props.lastFoldedTimestamp
      debugger
      this.list.recomputeRowHeights(this.props.lastFoldedIndex)
      this.list.forceUpdateGrid()
    }
  }

  renderRow({ index, parent, isScrolling, key, style }) {
    const cx = `--${this.getRowHeight({ index })}__lines_${this.props.logs[index].lines.length}`
    delete style.height
    return (
      <CellMeasurer
          cache={this.cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
          key={key}>
        <div style={style} className={cx}>
          <Log data={this.props.logs[index]} />
        </div>
      </CellMeasurer>
    )
  }

  getRowHeight({ index }) {
    const log = this.props.logs[index]
    const lines = log.lines.length

    if (log.folded)
      return (43 + 12)

    if (log.showAll)
      return 50 + lines * 24

    return (67 + 12) + Math.min(lines, 10) * 24
  }

  render() {
    const { logs } = this.props

    return (
      <AutoSizer ref='container'>
      {
        ({width, height}) => (
          <List className='LogContainer'
            ref={(ref) => this.list = ref}
            height={height}
            width={width}
            overscanRowCount={10}
            rowCount={logs.length}
            rowHeight={this.cache.rowHeight}
            noRowsRenderer={() => <div className='LogContainer-empty'>No visible logs</div>}
            rowRenderer={this.renderRow}
          />
        )
      }
      </AutoSizer>
    )
  }
}

export default connect(mapStateToProps)(LogContainer);
