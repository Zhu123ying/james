/* eslint-disable */
import React from 'react'
import { Tooltip, Dropdown } from 'ultraui'

const _ = window._

// 集群资源相关常量start
// 集群资源类型列表
const clusterResourceTypeList = ['ClusterRole', 'Namespace', 'Node', 'PersistentVolume', 'StorageClass']

// 以下是通用的cloumn，列出了复用
// 名称
const clusterResourceName = (intl) => {
    return {
        title: intl.formatMessage({ id: 'Name' }),
        dataIndex: 'runInfo',
        key: 'name',
        render(runInfo, row) {
            return _.get(row, 'runInfo.metadata.name', '')
        }
    }
}
// 标签
const clusterResourceLabels = (intl) => {
    return {
        title: intl.formatMessage({ id: 'AppTag' }),
        dataIndex: 'runInfo',
        key: 'labels',
        render(runInfo, row) {
            let labelObj = _.get(row, 'runInfo.metadata.labels', {}) || {}
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
    }
}

// 运行状态
const runningState = (intl) => {
    return {
        title: intl.formatMessage({ id: 'RunningState' }),
        dataIndex: 'runInfo',
        key: 'RunningState',
        render(runInfo, row) {
            return _.get(row, 'runInfo.STATUS', '')
        }
    }
}

const createTime = (intl) => {
    return {
        title: intl.formatMessage({ id: 'CreateTime' }),
        dataIndex: 'createTime'
    }
}

// 集群资源表格column列表
const clusterResourceTypeColumns = (this_) => {
    const { intl } = this_.props
    return {
        'ClusterRole': [clusterResourceName(intl), createTime(intl)],
        'Namespace': [
            clusterResourceName(intl),
            clusterResourceLabels(intl),
            runningState(intl),
            createTime(intl),
            {
                dataIndex: 'id',
                key: 'operate',
                columnType: 'action',
                width: '10%',
                minCalcuWidth: 100,
                title: intl.formatMessage({ id: 'Operate' }),
                render: (id, data) => {
                    const options = [
                        {
                            name: `${intl.formatMessage({ id: 'AppTag' })}${intl.formatMessage({ id: '::Manage' })}`,
                            callback: () => {
                                this_.handleManageNameSpaceLabel(data)
                            }
                        }
                    ]
                    return (
                        <Dropdown title="" icon="more" btnSize="small" options={options} btnType="text" placement='bottomRight' />
                    )
                }
            }
        ],
        Node: [clusterResourceName(intl), clusterResourceLabels(intl), runningState(intl), createTime(intl)],
        'PersistentVolume': [
            clusterResourceName(intl),
            {
                title: intl.formatMessage({ id: 'Capacity' }),
                dataIndex: 'runInfo',
                key: 'CAPACITY',
                render: (val, row) => {
                    return _.get(row, 'runInfo.CAPACITY.storage.number', '')
                }
            },
            {
                title: 'ACCESS MODES',
                dataIndex: 'runInfo',
                key: 'ACCESS MODES',
                render: (val, row) => {
                    return _.get(row, 'runInfo.accessModes', []).join('、')
                }
            },
            {
                title: 'RECLAIM POLICY',
                dataIndex: 'runInfo',
                key: 'RECLAIM POLICY',
                render: (val, row) => {
                    return _.get(val, 'RECLAIM POLICY', '')
                }
            },
            runningState(intl),
            {
                title: 'CLAIM',
                dataIndex: 'runInfo',
                key: 'CLAIM',
                render: (val, row) => {
                    return _.get(row, 'runInfo.CLAIM', '')
                }
            },
            {
                title: 'STORAGECLASS',
                dataIndex: 'runInfo',
                key: 'STORAGECLASS',
                render: (val, row) => {
                    return _.get(row, 'runInfo.STORAGECLASS', '')
                }
            },
            {
                title: 'REASON',
                dataIndex: 'runInfo',
                key: 'REASON',
                render: (val, row) => {
                    return _.get(row, 'runInfo.REASON', '')
                }
            },
            createTime(intl)],
        'StorageClass': [
            clusterResourceName(intl),
            {
                title: 'provisioner',
                dataIndex: 'runInfo',
                key: 'provisioner',
                render: (val, row) => {
                    return _.get(row, 'runInfo.provisioner', '')
                }
            },
            {
                title: 'RECLAIM POLICY',
                dataIndex: 'runInfo',
                key: 'RECLAIM POLICY',
                render: (val, row) => {
                    return _.get(row, 'runInfo.RECLAIM POLICY', '')
                }
            },
            {
                title: 'VOLUMEBINDINGMODE',
                dataIndex: 'runInfo',
                key: 'VOLUMEBINDINGMODE',
                render: (val, row) => {
                    return _.get(row, 'runInfo.VOLUMEBINDINGMODE', '')
                }
            },
            {
                title: intl.formatMessage({ id: 'Parameters' }),
                dataIndex: 'runInfo',
                key: 'Parameters',
                render: (val, row) => {
                    return _.get(row, 'runInfo.Parameters', '')
                }
            },
            createTime(intl)]
    }
}

export {
    clusterResourceTypeList,
    clusterResourceTypeColumns
}