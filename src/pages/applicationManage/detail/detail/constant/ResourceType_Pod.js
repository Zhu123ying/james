/* eslint-disable */
// 资源对象下产生的最底层的pod
import React from 'react'
import { getDataKey, compositeStateColor, compositeStateText } from './index'
import { Tooltip, SortTable, Dropdown } from 'ultraui'

const _ = window._

export default (intl, data, this_) => {
    return {
        columns: [
            {
                title: intl.formatMessage({ id: 'ComprehensiveState' }),
                dataIndex: 'compositeState',
                key: 'compositeState',
                width: '90px',
                render(state, row) {
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
                    return _.get(row, `kind`, '')
                }
            },
            {
                title: intl.formatMessage({ id: 'Name' }),
                dataIndex: 'runInfo',
                key: 'name',
                render(runInfo, row) {
                    return _.get(row, `metadata.name`, '')
                }
            },
            {
                title: intl.formatMessage({ id: 'AppTag' }),
                dataIndex: 'runInfo',
                key: 'labels',
                render(runInfo, row) {
                    let labelObj = _.get(row, `metadata.labels`, {})
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
                    return _.get(row, `stateInfo.status`, '')
                }
            },
            {
                title: 'CPU',
                dataIndex: 'cpu',
                key: 'cpu',
                render(val, row) {
                    let cpuNum = parseFloat(val || 0)
                    return cpuNum ? `${(cpuNum * 100).toFixed()}%` : 0
                }
            },
            {
                title: 'Memory',
                dataIndex: 'memory',
                key: 'memory',
                render(val, row) {
                    let memoryNum = parseFloat(val || 0)
                    return memoryNum ? `${memoryNum.toFixed()}Mi` : 0
                }
            },
            {
                title: intl.formatMessage({ id: 'Operate' }),
                key: 'Operate',
                width: '64px',
                render: (id, row) => {
                    const options = [
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
                            disabled: !_.get(row, `status.containerStatuses`), // 如果取不到则禁用
                            callback: () => {
                                let name = _.get(row, `metadata.name`, '')
                                let namespace = _.get(row, `metadata.namespace`, '')
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
        rowKey: (row) => _.get(row, `metadata.name`, ''),
        data
    }
}