/* eslint-disable */
import React, { useState, useEffect } from 'react'
import TableCommon from '~/components/TableCommon'
import { useIntl } from 'react-intl'
import { DEFAULT_EMPTY_LABEL } from 'Cnst/config'
import { resource as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import moment from 'moment'

const NetworkResourceManage = ({
  history
}) => {
  /* 定义该组件使用的常量 */
  const intl = useIntl()
  const uniquePageKey = 'applicationCenter_networkResourceManage'

  /* 定义当前使用变量state */
  const [queryParams, setQueryParams] = useState({
    pageNumber: 1,
    pageSize: 20,
    name: ''
  })
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!_.isEmpty(queryParams)) {
      handleQuery()
    }
  }, [queryParams])

  /* 初始化数据设置和调用 */

  /* table相关操作 */
  // 请求table数据
  const handleQuery = () => {
    const { pageNumber, pageSize, name } = queryParams
    const params = {
      pageNumber,
      pageSize,
      conditions: {
        name
      }
    }
    setLoading(true)
    HuayunRequest(api.querylistSdnNetwork, params, {
      success: (res) => {
        const { data, totalCount } = res
        setTableData(data)
        setTotal(totalCount)
      },
      complete: () => {
        setLoading(false)
      }
    })
  }
  // 刷新table数据
  const handleRefresh = () => {
    handleQuery()
  }
  // 更新table数据
  const handleTableChange = (params) => {
    setQueryParams(params)
  }
  // table的列项目
  const columns = [
    {
      dataIndex: 'ref',
      key: 'ref',
      title: 'ID',
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: intl.formatMessage({ id: 'Name' })
    },
    {
      dataIndex: 'ownerId',
      key: 'ownerId',
      title: '归属'
    },
    {
      dataIndex: 'availableZoneName',
      key: 'availableZoneName',
      title: '可用区'
    },
    {
      dataIndex: 'networkType',
      key: 'networkType',
      title: intl.formatMessage({ id: 'NetworkType' })
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      title: intl.formatMessage({ id: 'CreateTime' })
    },
  ]

  return (
    <TableCommon
      searchOption={{
        key: 'name',
        title: intl.formatMessage({ id: 'Name' })
      }}
      params={queryParams}
      paramsAlias={{
        name: {
          title: '名称'
        }
      }}
      uniqueId={uniquePageKey}
      onRefresh={handleRefresh}
      onTableChange={handleTableChange}
      total={total}
      columns={columns}
      loading={loading}
      data={tableData}
      checkable={false} // 是否需要复选框
      extraParams={[]} // 额外不体现在搜索条件的参数
    />
  )
}

export default NetworkResourceManage
