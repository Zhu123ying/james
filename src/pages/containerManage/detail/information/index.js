/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import TableCommon from '~/components/TableCommon';
class Information extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: []
        }
    }
    componentDidMount() {
        this.getTableData()
    }
    getTableData = () => {
        const { id: platformContainerId } = this.props.detail
        HuayunRequest(api.getMessages, { platformContainerId }, {
            success: (res) => {
                this.setState({
                    tableData: res.data.messages
                })
            }
        })
    }
    getColums = () => {
        const { intl } = this.props
        return [
            {
                dataIndex: 'type',
                key: 'type',
                title: intl.formatMessage({ id: 'Type' })
            },
            {
                dataIndex: 'status',
                key: 'status',
                title: intl.formatMessage({ id: 'Status' })
            },
            {
                dataIndex: 'message',
                key: 'message',
                title: intl.formatMessage({ id: 'Message' })
            },
            {
                dataIndex: 'reason',
                key: 'reason',
                title: intl.formatMessage({ id: 'Reason' })
            },
            {
                dataIndex: 'time',
                key: 'time',
                title: intl.formatMessage({ id: 'LastUpdateTime' })
            }
        ]
    }
    render() {
        const { intl, detail } = this.props
        const { tableData } = this.state
        const tableColumns = this.getColums()
        return (
            <div className='containerDetail_information'>
                <TableCommon
                    uniqueId='applicationCenter_container_information'
                    onRefresh={this.getTableData}
                    columns={tableColumns}
                    data={tableData}
                    noPage={true}
                    checkable={false}
                />
            </div>
        )
    }
}

export default Information
