/* eslint-disable */
import React from 'react'
import { getDataKey, compositeStateColor } from './index'
import { Tooltip, SortTable } from 'ultraui'
import { Table } from 'huayunui'
import ResourceType_Pod from './ResourceType_Pod'

const _ = window._

export default (intl, data, this_, key) => {
    return {
        columns: [
            {
                title: intl.formatMessage({ id: 'ComprehensiveState' }),
                dataIndex: 'compositeState',
                key: 'compositeState',
                width: '90px',
                render(state, row) {
                    return <div className="compositeStateDot" style={{ backgroundColor: compositeStateColor[state] }} />
                }
            },
            {
                title: intl.formatMessage({ id: 'Type' }),
                dataIndex: 'kind',
                key: 'kind',
            },
            {
                title: intl.formatMessage({ id: 'Name' }),
                dataIndex: 'metadata',
                key: 'name',
                render(metadata, row) {
                    return _.get(row, `metadata.name`, '')
                }
            },
            {
                title: intl.formatMessage({ id: 'AppTag' }),
                dataIndex: 'metadata',
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
                title: 'running',
                dataIndex: 'running',
                key: 'running'
            },
            {
                title: 'succeeded',
                dataIndex: 'succeeded',
                key: 'succeeded'
            },
            {
                title: 'failed',
                dataIndex: 'failed',
                key: 'failed'
            }
        ],
        rowKey: (row) => _.get(row, `metadata.name`, new Date()),
        expandedRowRender: (row, index, indent, expanded) => {
            let tableProps = ResourceType_Pod(intl, row.pods, this_)
            const { data: dataSource, ...otherTableProps } = tableProps
            return (<Table
                {...otherTableProps}
                dataSource={dataSource}
                pagination={false}
                // scroll={{ x: '100%' }}
            />)
        },
        data
    }
}