/* eslint-disable */
import React from 'react'
import { getDataKey, compositeStateColor, compositeStateText } from './index'
import { Tooltip, SortTable, Dropdown } from 'ultraui'
import { Table } from 'huayunui'
// runInfo下如果有replicaSet则取runInfo下如果有replicaSet则取，否则取pods
import ResourceType_Pod from './ResourceType_Pod'
import ReplicaSet from './ReplicaSet'

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
                    return (
                        <div className='stateLineWithDot'>
                            <div className='stateDot' style={{ backgroundColor: compositeStateColor[state] }}></div>
                            {compositeStateText[state]}
                        </div>
                    )
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
                title: 'PODS',
                dataIndex: 'runInfo',
                key: 'DESIRED_CURRENT',
                render(runInfo, row) {
                    let CURRENT = _.get(row, `${getDataKey(row)}CURRENT`) || 0
                    let DESIRED = _.get(row, `${getDataKey(row)}DESIRED`) || 0
                    return (
                        <div className="Desired_Current">
                            <span>Desired: {DESIRED}</span>
                            <span>Current: {CURRENT}</span>
                        </div>
                    )
                }
            },
            {
                title: intl.formatMessage({ id: 'CreateTime' }),
                dataIndex: 'createTime'
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
            let replicaSets = _.get(row, 'runInfo.replicaSets', [])
            let pods = _.get(row, 'runInfo.pods', [])
            if (replicaSets.length) {
                return (
                    <div>
                        {
                            replicaSets.map(item => {
                                let tableProps = ReplicaSet(intl, [item], this_, key, 2)
                                const { data: dataSource, ...otherTableProps } = tableProps
                                return (<Table
                                    {...otherTableProps}
                                    dataSource={dataSource}
                                    pagination={false}
                                // scroll={{ x: '100%' }}
                                />)
                            })
                        }
                    </div>
                )
            } else {
                let tableProps = ResourceType_Pod(intl, pods, this_)
                const { data: dataSource, ...otherTableProps } = tableProps
                return (<Table
                    {...otherTableProps}
                    dataSource={dataSource}
                    pagination={false}
                // scroll={{ x: '100%' }}
                />)
            }
        },
        data
    }
}