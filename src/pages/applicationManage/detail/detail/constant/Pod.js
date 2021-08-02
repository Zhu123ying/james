/* eslint-disable */
import React from 'react'
import { getDataKey, compositeStateColor, compositeStateText } from './index'
import { Tooltip, Dropdown } from 'ultraui'

const _ = window._

export default (intl, data, this_) => {
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
                title: intl.formatMessage({ id: 'Status' }),
                dataIndex: 'runInfo',
                key: 'status',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}stateInfo.status`, '')
                }
            },
            {
                title: 'CPU',
                dataIndex: 'runInfo',
                key: 'cpu',
                render(runInfo, row) {
                    let cpu = _.get(row, `${getDataKey(row)}cpu`, 0)
                    let cpuNum = parseFloat(cpu)
                    return cpuNum ? `${(cpuNum * 100).toFixed()}%` : 0
                }
            },
            {
                title: 'Memory',
                dataIndex: 'runInfo',
                key: 'memory',
                render(runInfo, row) {
                    let memory = _.get(row, `${getDataKey(row)}memory`, 0)
                    let memoryNum = parseFloat(memory)
                    return memoryNum ? `${memoryNum.toFixed()}Mi` : 0
                }
            },
            {
                title: 'nodeName',
                dataIndex: 'runInfo',
                key: 'schnodeNameedule',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}nodeName`, '')
                }
            },
            {
                title: 'controlledBy',
                dataIndex: 'runInfo',
                key: 'controlledBy',
                render(runInfo, row) {
                    return _.get(row, `${getDataKey(row)}controlledBy`, '')
                }
            },
            {
                title: intl.formatMessage({ id: 'Operate' }),
                dataIndex: 'id',
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
                        },
                        {
                            name: intl.formatMessage({ id: 'PodMonitorDetail' }),
                            disabled: !_.get(row, `${getDataKey(row)}status.containerStatuses`), // 如果取不到则禁用
                            callback: () => {
                                let name = _.get(row, `${getDataKey(row)}metadata.name`, '')
                                let namespace = _.get(row, `${getDataKey(row)}metadata.namespace`, '')
                                this_.seePodMonitorDetail(name, namespace)
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
        data
    }
}