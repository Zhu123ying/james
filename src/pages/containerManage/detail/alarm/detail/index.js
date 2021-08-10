/* eslint-disable */
/* 告警记录详情 */
import React, { useState, useEffect } from 'react'
import TableCommon from '~/components/TableCommon'
import { Static } from 'ultraui'
import { useIntl } from 'react-intl'
import { DEFAULT_EMPTY_LABEL } from 'Cnst/config'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import moment from 'moment'

const customerRoutes = [
    {
        path: '/',
        breadcrumbName: '应用中心'
    },
    {
        path: '/applicationCenter/containerManage',
        breadcrumbName: '容器管理'
    },
    {
        path: '',
        breadcrumbName: '告警详情'
    }
]
const AlarmRecordDetail = ({
    history, handleExtra
}) => {
    useEffect(() => {
        handleExtra({
            customerRoutes
        })
    }, [])
    /* 定义该组件使用的常量 */
    const intl = useIntl()
    const uniquePageKey = 'applicationCenter_container_alarmDetail'
    const alarmLevel = [
        {
            name: intl.formatMessage({ id: 'All' }),
            value: 2
        },
        {
            name: intl.formatMessage({ id: 'Serious' }),
            value: 1
        },
        {
            name: intl.formatMessage({ id: 'General' }),
            value: 0
        }
    ]
    const resolveStatus = [
        {
            name: intl.formatMessage({ id: 'All' }),
            value: 3
        },
        {
            name: intl.formatMessage({ id: 'Resolved' }),
            value: 1
        },
        {
            name: intl.formatMessage({ id: 'Resolving' }),
            value: 0
        }
    ]

    /* 定义当前使用变量state */
    const [queryParams, setQueryParams] = useState({
        pageNumber: 1,
        pageSize: 20
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
        let queryParamsObj = { ...queryParams }
        queryParamsObj.alarmId = history.location.pathname.split('alarmRecordDetail/')[1]
        setLoading(true)
        HuayunRequest(api.listAlertAlarmDetails, queryParamsObj, {
            success: (res) => {
                const { alarmDetails, totalRecord } = res.data
                setTableData(alarmDetails)
                setTotal(totalRecord)
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
        // 指标名称
        {
            dataIndex: 'metric',
            key: 'metric',
            title: intl.formatMessage({ id: 'ItemName' }),
            render: (value) => (value || '-')
        },
        // 告警规则
        {
            dataIndex: 'rule',
            key: 'rule',
            title: intl.formatMessage({ id: 'AlarmRule' }),
            render: (value) => (value || '-')
        },
        // 告警等级
        {
            dataIndex: 'level',
            key: 'level',
            title: intl.formatMessage({ id: 'AlarmLevel' }),
            filter: {
                type: 'Radio',
                options: alarmLevel.map((item) => {
                    return {
                        key: item.value,
                        title: item.name,
                        value: item.value
                    }
                }),
                value: _.get(queryParams, 'level', '')
            },
            render: (value) => {
                let type = value < 3 ? 'danger' : 'warning'
                let record = value < 3 ? intl.formatMessage({ id: 'Serious' }) : intl.formatMessage({ id: 'General' })
                return <Static type={type} value={record} />
            }
        },
        // 解决状态
        {
            dataIndex: 'status',
            key: 'status',
            title: intl.formatMessage({ id: 'ResolveStatus' }),
            filter: {
                type: 'Radio',
                options: resolveStatus.map((item) => {
                    return {
                        key: item.value,
                        title: item.name,
                        value: item.value
                    }
                }),
                value: _.get(queryParams, 'status', '')
            },
            render: (value) => {
                let status = value === 0 ? { value: intl.formatMessage({ id: 'Resolving' }), type: 'danger' } : (
                    value === 1 ? { value: intl.formatMessage({ id: 'Resolved' }), type: 'success' } : { value: intl.formatMessage({ id: 'Ignored' }), type: 'default' }
                )
                return (
                    <Static type={status.type} value={status.value} />
                )
            }
        },
        // 告警详情
        {
            dataIndex: 'detail',
            key: 'detail',
            width: '40%',
            title: intl.formatMessage({ id: 'AlarmItemDetail' })
        },
        // 告警时间
        {
            dataIndex: 'timestamp',
            key: 'timestamp',
            title: intl.formatMessage({ id: 'AlarmTime' }),
            className: 'table-create-time',
            filter: {
                type: 'DatePicker',
                props: {
                    format: 'YYYY-MM-DD HH:mm:ss'
                },
                value: _.get(queryParams, 'timestamp')
            },
            render: (value) => {
                let timenew = moment(value).format('YYYY-MM-DD HH:mm:ss')
                const time = timenew && timenew.split(' ')
                return time && time.length ? <div className="table-create-time-div"><span className="table-create-time-span">{time[0]}</span>&nbsp;<span className="table-create-time-span">{time[1]}</span></div> : DEFAULT_EMPTY_LABEL
            }
        }
    ]

    return (
        <TableCommon
            uniqueId={uniquePageKey}
            params={queryParams}
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

export default AlarmRecordDetail
