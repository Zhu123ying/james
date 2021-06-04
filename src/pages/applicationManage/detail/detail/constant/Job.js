/* eslint-disable */
import React from 'react'
import { getDataKey, compositeStateColor } from './index'
import { Tooltip, SortTable, Dropdown } from 'ultraui'
import { Table } from 'huayunui'
import ResourceType_Pod from './ResourceType_Pod'

const _ = window._

export default (intl, data, this_, key) => {
    return {
        columns: [
            {
                title: intl.formatMessage({ id: 'ComprehensiveState' }),
                dataIndex: 'runInfo',
                key: 'compositeState',
                width: '90px',
                render(runInfo, row) {
                    const state = _.get(row, `${getDataKey(row)}compositeState`, '')
                    return <div className="compositeStateDot" style={{ backgroundColor: compositeStateColor[state] }} />
                }
            },
            {
                title: intl.formatMessage({ id: 'Type' }),
                dataIndex: 'runInfo',
                key: 'kind',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}kind`, '')
                }
            },
            {
                title: intl.formatMessage({ id: 'Name' }),
                dataIndex: 'runInfo',
                key: 'name',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}metadata.name`, '')
                }
            },
            {
                title: intl.formatMessage({ id: 'AppTag' }),
                dataIndex: 'runInfo',
                key: 'labels',
                render(runInfo, row) {
                    let labelObj = _.get(row, `${getDataKey(row)}metadata.labels`, {}) || {}
                    let str = (
                        <React.Fragment>
                            {
                                Object.keys(labelObj).map(key => {
                                    return (
                                        <React.Fragment>
                                            {`${key}:${labelObj[key]}`}<br />
                                        </React.Fragment>
                                    )
                                })
                            }
                        </React.Fragment>
                    )
                    return (
                        <Tooltip tips={str}>
                            <div className="labelList">{str}</div>
                        </Tooltip>
                    )
                }
            },
            {
                title: 'running',
                dataIndex: 'runInfo',
                key: 'running',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}running`, '')
                }
            },
            {
                title: 'succeeded',
                dataIndex: 'runInfo',
                key: 'succeeded',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}succeeded`, '')
                }
            },
            {
                title: 'failed',
                dataIndex: 'runInfo',
                key: 'failed',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}failed`, '')
                }
            },
            {
                title: intl.formatMessage({ id: 'Operate' }),
                key: 'Operate',
                width: '64px',
                render: (id, row) => {
                    const options = [
                        {
                            name: intl.formatMessage({ id: 'ReadStatementInfor' }),
                            callback: () => {
                                this_.readStatementInfor(row)
                            }
                        },
                        {
                            name: intl.formatMessage({ id: 'ReadNodeEvent' }),
                            callback: () => {
                                this_.readNodeEvent(row)
                            }
                        },
                        {
                            name: intl.formatMessage({ id: 'ReadNodeMessage' }),
                            callback: () => {
                                this_.readNodeMessage(row)
                            }
                        }
                    ]
                    return (
                        <Dropdown title="" icon="more" btnSize="small" options={options} btnType="text" placement='bottomRight' />
                    )
                }
            }
        ],
        rowKey: (row) => row.id,
        expandedRowRender: (row, index, indent, expanded) => {
            let tableProps = ResourceType_Pod(intl, row.runInfo.pods, this_)
            const { data: dataSource, ...otherTableProps } = tableProps
            return (<Table
                {...otherTableProps}
                dataSource={dataSource}
                pagination={false}
                scroll={{ x: '100%' }}
            />)
        },
        data
    }
}