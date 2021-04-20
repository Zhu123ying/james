/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Search, Panel, Loading } from 'ultraui'
import { Row, Col } from 'antd'
import ButtonGroup from './ButtonGroup'
import AdvancedSearch from './AdvancedSearch'
import { TableView } from './BaseView'

import './index.less'

const ADVANCED_SEARCH_TYPE = {
  TIME_RANGE: 'TIME_RANGE',
  TIME: 'TIME',
  CASCADE: 'CASCADE',
  TEXT: 'TEXT',
  SELECT: 'SELECT'
}

const BaseList = props => {
  const {
    btnGroupConfig,
    searchOptions,
    advancedSearchOptions,
    hasAdvance,
    defaultCollapsed = true,
    tableParams,
    tableColums,
    tableData,
    onChangeParams,
    onRequest
  } = props

  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [searchParams, setSearchParams] = useState({})
  const [advancedSearchParams, setAdvancedSearchParams] = useState({})

  useEffect(() => {}, [])

  const handleSearchSubmit = result => {
    onRequest({ ...searchParams, ...advancedSearchParams })
  }

  const handleSearchChange = value => {
    setSearchParams({ ...value })
    onChangeParams({ ...value, ...advancedSearchParams })
  }

  const handleAdvancedSearchSubmit = value => {
    setAdvancedSearchParams({ ...value })
    onChangeParams({ ...searchParams, ...value })
    onRequest({ ...searchParams, ...value })
  }

  const handleCollapsed = value => {
    setCollapsed(!collapsed)
  }

  // 按钮组
  const renderButtonGroup = () => {
    return <ButtonGroup {...btnGroupConfig} />
  }

  // 高级搜索 - 模糊搜索
  const renderSearch = () => {
    const { key, placeholder } = searchOptions
    return (
      <Search
        onSearch={handleSearchSubmit}
        onChange={v => handleSearchChange({ [`${key}`]: v })}
        option={[`${key}`]}
        placeholder={placeholder}
        isAdvance={hasAdvance}
        collapsed={collapsed}
        onCollapsed={handleCollapsed}
      />
    )
  }

  // 高级搜索
  const renderAdvancedSearch = () => {
    if (!hasAdvance) {
      return null
    }

    return (
      <AdvancedSearch
        advancedSearchOptions={advancedSearchOptions}
        collapsed={collapsed}
        onSubmit={handleAdvancedSearchSubmit}
      />
    )
  }

  const renderTable = () => {
    const {
      isLoading = false,
      sortKey,
      sortOrder,
      emptyText,
      handleSortChange,
      handleChecked,
      handleCheckedAll,
      total,
      pageIndex,
      pageSize,
      handlePageChange,
      handlePageSizeChange,
      ...other
    } = tableParams
    return (
      <TableView
        // {...this.props}
        // ref={ref => {
        //     const table = _.get(ref, 'table', null)
        //     if (table) {
        //         this.table = table
        //     }
        // }}
        {...other}
        className={'abcd' + '-sort-table'}
        columns={tableColums}
        rows={tableData}
        isLoading={isLoading}
        rowKey={row => row.id}
        defaultSortKey={sortKey}
        defaultSortState={sortOrder}
        sortKey={sortKey}
        sortState={sortOrder}
        onSortChange={handleSortChange}
        checkAllAble
        onChecked={handleChecked}
        onCheckedAll={handleCheckedAll}
        emptyText={emptyText}
        // checkData={this.getCheckData(this.props)}
        total={total}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        paginationOptions={{}}
        columnResizeable
        shouldClear
      />
    )
  }

  return (
    <Panel
      style={{ padding: '0 16px', margin: 0, minHeight: 'calc(100vh - 202px)' }}
    >
      <Row
        className="ult-list-head"
        justify="space-between"
        style={{ padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}
      >
        <div className="ult-list-head-left">{renderButtonGroup()}</div>
        <div className="ult-list-head-right">{renderSearch()}</div>
      </Row>
      {renderAdvancedSearch()}
      {renderTable()}
    </Panel>
  )
}

BaseList.propTypes = {
  btnGroupConfig: PropTypes.object,
  searchOptions: PropTypes.object,
  advancedSearchOptions: PropTypes.array,
  hasAdvance: PropTypes.bool,
  defaultCollapsed: PropTypes.bool,
  tableParams: PropTypes.object,
  tableColums: PropTypes.array,
  tableData: PropTypes.array,
  onChangeParams: PropTypes.func,
  onRequest: PropTypes.func
}

BaseList.defaultProps = {
  btnGroupConfig: {
    // 按钮组数据
    option: [
      {
        icon: 'refresh',
        type: 'default',
        onClick: () => {}
      },
      {
        icon: 'add',
        type: 'primary',
        name: '创建',
        onClick: () => {}
      },
      {
        icon: 'empty',
        type: 'default',
        name: '删除',
        disabled: true,
        auth: true,
        onClick: () => {}
      }
    ]
    // 如果定义了就会走自定义render, 不会渲染预制按钮组
    // render: () => {}
  },
  searchOptions: {
    key: 'nameLike',
    value: '',
    placeholder: '请输入名称'
  },
  // 高级搜索相关
  advancedSearchOptions: [
    {
      type: ADVANCED_SEARCH_TYPE.TIME_RANGE,
      key: 'createTime',
      label: '创建时间',
      props: {}
    },
    // {
    // 	type: ADVANCED_SEARCH_TYPE.TIME,
    // 	key: 'createTime',
    // 	label: '创建时间',
    // 	props: {}
    // },
    {
      type: ADVANCED_SEARCH_TYPE.CASCADE,
      key: 'ownerType',
      label: '归属',
      props: {
        // defaultValue: ['Project', 'All'],
        options: [
          {
            value: 'All',
            label: '全部'
          },
          {
            value: 'System',
            label: 'System'
          },
          {
            value: 'Project',
            label: '项目',
            children: [
              {
                value: 'All',
                label: '全部'
              },
              {
                value: 'one',
                label: 'one'
              },
              {
                value: 'two',
                label: 'two'
              }
            ]
          }
        ]
      }
    },
    {
        type: ADVANCED_SEARCH_TYPE.TEXT,
        key: 'network',
        label: '网络',
        props: {
            placeholder: '请输入IP地址'
        }
    },
    {
        type: ADVANCED_SEARCH_TYPE.SELECT,
        key: 'type',
        label: '类型',
        props: {
            options: [
                {
                    key: '1',
                    name: '1',
                    value: '1'
                },
                {
                    key: '2',
                    name: '2',
                    value: '2'
                }
            ]
        }
    }
  ],
  hasAdvance: true,
  defaultCollapsed: true,
  // 列表相关
  tableParams: {
    isLoading: false,
    sortKey: '',
    sortOrder: '',
    emptyText: '',
    handleSortChange: v => console.log(v),
    handleChecked: v => console.log(v),
    handleCheckedAll: v => console.log(v),
    total: 3,
    pageIndex: 1,
    pageSize: 20,
    handlePageChange: v => console.log(v),
    handlePageSizeChange: v => console.log(v)
  },
  tableColums: [
    {
      title: '日期',
      dataIndex: 'date',
      width: '20%'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: '20%',
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '20%'
    },
    {
      title: '说明',
      dataIndex: 'note',
      width: '20%'
    },
    {
      title: '操作',
      width: '20%',
      key: 'action',
      render: () => <a>Delete</a>
    }
  ],
  tableData: [
    {
      key: 0,
      date: '2018-02-11',
      amount: 120,
      type: 'income',
      note: 'transfer'
    },
    {
      key: 1,
      date: '2018-03-11',
      amount: 243,
      type: 'income',
      note: 'transfer'
    },
    {
      key: 2,
      date: '2018-04-11',
      amount: 98,
      type: 'income',
      note: 'transfer'
    }
  ],
  onChangeParams: params => {
    console.log(params)
  },
  onRequest: params => {
    console.log(params)
  }
}

export default BaseList
