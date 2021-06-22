/* eslint-disable */
import React from 'react'
import { Icon, Notification, Loading } from 'ultraui'
import { Button, Collapse, Table, Checkbox, Modal, Input } from 'huayunui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import { formatChartValues } from '~/pages/utils'

const _ = window._
class NodeResource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentConfig: _.get(props, 'tableData.0.config', '')
        }
    }
    getTableColumns = () => {
        const { intl } = this.props
        return [
            {
                key: 'name',
                dataIndex: 'name',
                title: intl.formatMessage({ id: 'Name' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL,
                width: '45%'
            },
            {
                key: 'kind',
                dataIndex: 'kind',
                title: intl.formatMessage({ id: 'Type' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL,
                width: '25%'
            },
            {
                key: 'num',
                dataIndex: 'num',
                title: intl.formatMessage({ id: 'NumberOfCopies' }),
                render: (val) => val || DEFAULT_EMPTY_LABEL,
                width: '80px',
                width: '30%'
            }
        ]
    }
    render() {
        const { intl, tableData } = this.props
        const { currentConfig } = this.state
        return (
            <div className='nodeResourceContent'>
                <Table
                    columns={this.getTableColumns()}
                    dataSource={tableData}
                    pagination={false}
                    rowKey='id'
                    onRow={(record, index) => {
                        return {
                            onClick: event => {
                                this.setState({
                                    currentConfig: record.config
                                })
                            }, // 点击行
                        }
                    }}
                />
                <div className='configInfo'>{currentConfig}</div>
            </div>
        )
    }
}

export default NodeResource
