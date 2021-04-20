/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/jsx-handler-names */
import React from 'react'
import ReactDOM from 'react-dom'
import { Pagination, SortTable } from 'ultraui'
import PropTypes from 'prop-types'
import PubSub from 'pubsub-js'
import _ from 'lodash'

import ResizeableTitle from './components/ResizeableTitle'
import './style.less'

class BaseTableView extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    rowKey: PropTypes.func.isRequired,
    defaultSortKey: PropTypes.string,
    defaultSortState: PropTypes.string,
    sortKey: PropTypes.string,
    sortState: PropTypes.string,
    onSortChange: PropTypes.func.isRequired,
    checkAllAble: PropTypes.bool.isRequired,
    onChecked: PropTypes.func.isRequired,
    onCheckedAll: PropTypes.func.isRequired,
    checkData: PropTypes.array,
    emptyText: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
      .isRequired,
    total: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
    pageIndex: PropTypes.number.isRequired, // 当前页
    pageSize: PropTypes.number.isRequired,
    paginationOptions: PropTypes.object,
    hidePage: PropTypes.bool,
    shouldClear: PropTypes.bool,
    expandable: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    isLoading: false,
    checkData: [],
    hidePage: false,
    paginationOptions: {},
    shouldClear: true,
    expandable: false
  };

  constructor(props) {
    super(props)
    this.state = {
      columns: props.columns,
      currentIndex: null,
      refreshKey: +new Date(),
      minWidthList: []
    }
  }

  components = {
    header: {
      cell: ResizeableTitle
    }
  };

  handleResize = index => (e, { size }) => {
    let { columns, tableWidth } = this.state
    let nextColumns = [...columns]
    let newx = size.width
    const currentWidthList = this.getCurrentWidthList(index, newx)
    const currentSum = this.props.checkAllAble
      ? _.sum(currentWidthList) + 38
      : _.sum(currentWidthList)
    if (currentSum - 3 > tableWidth) {
      // 允许误差3px
      // 自适应过还是超过列表宽度则禁止再拖动
      return
    }
    nextColumns = nextColumns.map((c, i) => {
      return {
        ...c,
        width: nextColumns.length - 1 === i ? null : currentWidthList[i]
      }
    })
    this.setState({
      columns: nextColumns
    })
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    } else {
      this.timer = setTimeout(() => {
        this.setState({
          refreshKey: +new Date()
        })
      }, 3000)
    }
    this.setColumnsSession(nextColumns)
  };

  getCurrentWidthList = (index, newWidth) => {
    const { columns, tableWidth, minWidthList } = this.state
    const currentSumWidth = this.props.checkAllAble
      ? _.sum(columns.map(c => c.width)) + 38
      : _.sum(columns.map(c => c.width))
    let widthList = columns.map((c, i) => {
      if (i === columns.length - 1) {
        return tableWidth - currentSumWidth
      }
      return c.width
    })
    // if (columns[index].width < newWidth) {
    //     widthList = widthList.map((w, i) => {
    //         if (i === index && newWidth >= this.minWidthList[i]) {
    //             return newWidth
    //         } else {
    //             return w
    //         }
    //     })
    //     const newWidthSum = this.props.checkAllAble ? _.sum(widthList) + 38 : _.sum(widthList)
    //     if (newWidthSum >= this.tableWidth) {
    //         widthList = this.dealResizeOutside(newWidthSum - this.tableWidth, widthList)
    //     }
    // } else {
    //     widthList = this.dealResizeInside(columns[index].width - newWidth, widthList, index)
    // }
    const diff = newWidth - widthList[index]
    widthList = widthList.map((w, i) => {
      if (i === index && newWidth >= minWidthList[i]) {
        return newWidth
      }
      if (i === index + 1 && w - diff >= minWidthList[i]) {
        return w - diff
      }
      return w
    })
    const newWidthSum = this.props.checkAllAble
      ? _.sum(widthList) + 38
      : _.sum(widthList)
    if (newWidthSum >= tableWidth) {
      widthList = this.dealResizeOutside(newWidthSum - tableWidth, widthList)
    }
    return widthList
  };

  componentDidMount() {
    this.getTableWidth(() => {
      this.initColumns()
    })
    window.addEventListener('resize', this.resizeListener, false)
    this.pubsub = PubSub.subscribe('SORTKEY_CHANGE', () => {
      this.resizeListener()
    })
    // !window.hasFrames && this.menuStatusListener()
  }

  menuStatusListener = () => {
    this.pubsub_menu_status = PubSub.subscribe('MENU_SIZE_STATUS', () => {
      this.resizeListener()
    })
  };
  resizeListener = () => {
    this.clearSession()
    this.getTableWidth(() => {
      this.initColumns()
    })
  };

  initColumns = () => {
    const { columns } = this.props
    this.setState({
      columns: this.dealColumnWidth(columns)
    })
  };

  getOriginDomTHWidthList = () => {
    const thDOMList = Array.from(
      document
        .querySelector(`.${this.props.className}`)
        .getElementsByTagName('th')
    )
    return thDOMList.map(th => Math.round(th.getBoundingClientRect().width))
  };

  getMinWidthList = () => {
    const { columns, checkAllAble } = this.props
    const originWidthList = this.getOriginDomTHWidthList()
    return columns.map((column, i) => {
      if (column.minCalcuWidth) {
        return column.minCalcuWidth
      }
      if (
        Object.prototype.toString.call(column.title) === '[object Object]' ||
        Object.prototype.toString.call(column.compare) === '[object Function]'
      ) {
        const _titleTextLength =
          _.get(column, 'title.props.title', '').length * 14 ||
          _.get(column, 'title', '').length * 14
        let minTextWidth = checkAllAble
          ? originWidthList[i + 1]
          : originWidthList[i]
        if (_titleTextLength) {
          minTextWidth = Math.min(_titleTextLength + 72, minTextWidth)
        }
        return minTextWidth
      }
      if (typeof column.title === 'string') {
        if (column.key === 'name') {
          return column.title.length * 14 + 16 + 38
        }
        return column.title.length * 14 + 16
      }
    })
  };

  getTableWidth = callback => {
    const tableEle = ReactDOM.findDOMNode(this).querySelector(
      `.${this.props.className}`
    )
    this.setState(
      {
        tableWidth: tableEle.clientWidth,
        minWidthList: this.getMinWidthList()
      },
      callback
    )
  };

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(nextProps.columns, this.props.columns) &&
      this.state.tableWidth
    ) {
      this.setState({
        columns: this.dealColumnWidth(nextProps.columns)
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener, false)
    this.pubsub_menu_status && PubSub.unsubscribe(this.pubsub_menu_status)
    this.pubsub && PubSub.unsubscribe(this.pubsub)
    this.clearSession()
  }

  handleCheck = (data = []) => {
    this.props.onChecked(data)
  };

  handleSortChange = (sortState, sortKey) => {
    this.props.onSortChange(sortState, sortKey)
  };

  handleCheckedAll = (data = []) => {
    this.props.onCheckedAll(data)
  };

  handlePageChange = pageIndex => {
    this.props.onPageChange(pageIndex)
  };

  handlePageSizeChange = pageSize => {
    this.props.onPageSizeChange(pageSize)
  };

  getFittedWidth = (width, i) => {
    return Math.max(width, this.state.minWidthList[i])
  };

  dealColumnWidth = columns => {
    const cleanColumns = columns.filter(c => !!c.title)
    const { tableWidth, minWidthList } = this.state
    if (!tableWidth || !minWidthList) {
      return []
    }
    let widthList = cleanColumns.map((c, i) => {
      if (_.isNumber(c.width)) {
        return this.getFittedWidth(c.width, i)
      }
      if (!c.width) {
        return false
      }
      if (c.width.indexOf && c.width.indexOf('%') > -1) {
        return this.getFittedWidth(
          Math.ceil((c.width.replace('%', '') / 100) * tableWidth),
          i
        )
      } else if (c.width !== '' && c.width !== undefined && c.width !== null) {
        return this.getFittedWidth(Number(c.width.replace('px', '')), i)
      }
    })
    const currentWidthSum = this.props.checkAllAble
      ? _.sum(widthList.filter(w => w)) + 38
      : _.sum(widthList.filter(w => w))
    if (widthList.some(w => !w)) {
      const aveWidth = Math.ceil(
        (tableWidth - currentWidthSum) / widthList.filter(w => !w).length
      )
      widthList = widthList.map((w, i) => {
        if (!w) {
          return Math.max(aveWidth, minWidthList[i])
        } else {
          return w
        }
      })
    }
    const newWidthSum = this.props.checkAllAble
      ? _.sum(widthList) + 38
      : _.sum(widthList)
    if (newWidthSum + 3 >= tableWidth) {
      // 允许误差值为3
      widthList = this.dealResizeOutside(newWidthSum - tableWidth, widthList)
    }
    return cleanColumns.map((c, i) => ({
      ...c,
      width: cleanColumns.length - 1 === i ? null : widthList[i]
    }))
  };

  dealResizeInside = (diffWidth, widthList, index) => {
    const { minWidthList } = this.state
    if (widthList[index] <= minWidthList[index]) {
      if (index === 0) {
        return widthList
      } else {
        return this.dealResizeInside(diffWidth, widthList, index - 1)
      }
    } else {
      let diff = Math.min(diffWidth, minWidthList[index])
      widthList[index] -= diff
      widthList[index + 1] += diff
      return widthList
    }
  };

  dealResizeOutside = (diffWidth, widthList) => {
    const { minWidthList } = this.state
    if (diffWidth === 0 || _.sum(widthList) === _.sum(minWidthList)) {
      return widthList
    }
    widthList = widthList.map((w, i) => {
      if (diffWidth === 0 || w <= minWidthList[i]) {
        return w
      }
      if (w > minWidthList[i]) {
        diffWidth -= 1
        return w - 1
      }
    })
    if (diffWidth > 0) {
      return this.dealResizeOutside(diffWidth, widthList)
    } else {
      return widthList
    }
  };

  getColumnsSession = () => {
    const storeColumnWidth = window.sessionStorage.getItem('storeColumnWidth')
    const widthList = _.get(
      JSON.parse(storeColumnWidth),
      this.props.className,
      []
    )
    const { columns } = this.state
    if (_.isEmpty(widthList)) {
      return columns
    } else {
      return columns.map((col, i) => ({
        ...col,
        width: widthList[i]
      }))
    }
  };

  setResizeEventToColumn = () => {
    return this.getColumnsSession().map((col, index) => {
      return {
        ...col,
        onHeaderCell: column => {
          return {
            width: Number(column.width),
            onResize: this.handleResize(index)
          }
        }
      }
    })
  };

  setColumnsSession = columns => {
    const widthList = columns.map(col => col.width)
    window.sessionStorage.setItem(
      'storeColumnWidth',
      JSON.stringify({
        [this.props.className]: widthList
      })
    )
  };

  clearSession = () => {
    window.sessionStorage.setItem('storeColumnWidth', null)
  };

  render() {
    const {
      className,
      rows,
      isLoading,
      rowKey,
      defaultSortKey,
      defaultSortState,
      sortKey,
      sortState,
      prefixCls,
      checkAllAble,
      emptyText,
      checkData,
      pageIndex,
      pageSize,
      total,
      paginationOptions,
      hidePage,
      shouldClear,
      expandable
    } = this.props
    const { refreshKey } = this.state
    const rsColumns = this.setResizeEventToColumn()
    return (
      <div className="sort-resizable-table-wrapper" key={refreshKey}>
        <SortTable
          ref={node => {
            this.table = node
          }}
          components={this.components} // 列拖拽
          className={className}
          columns={rsColumns}
          data={rows}
          isLoading={isLoading}
          rowKey={rowKey}
          defaultSortKey={defaultSortKey}
          defaultSortState={defaultSortState}
          sortKey={sortKey}
          sortState={sortState}
          prefixCls={prefixCls}
          handleSortChange={this.handleSortChange}
          checkAllAble={checkAllAble}
          onChecked={this.handleCheck}
          onCheckedAll={this.handleCheckedAll}
          emptyText={emptyText}
          checkData={checkData}
          shouldClear={shouldClear}
          expandable={expandable}
        />
        {rows.length > 0 && !hidePage && !isLoading ? (
          <Pagination
            langCode={window.LangCode}
            pageIndex={pageIndex}
            pageSize={pageSize}
            total={total}
            onPageChange={this.handlePageChange}
            onPageSizeChange={this.handlePageSizeChange}
            rich
            {...paginationOptions}
          />
        ) : null}
      </div>
    )
  }
}

export default BaseTableView
