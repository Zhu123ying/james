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
class Event extends React.Component {
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
        HuayunRequest(api.getEvents, { platformContainerId }, {
            success: (res) => {
                this.setState({
                    tableData: res.data.events
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
                dataIndex: 'note',
                key: 'note',
                title: intl.formatMessage({ id: 'Message' })
            },
            {
                dataIndex: 'reason',
                key: 'reason',
                title: intl.formatMessage({ id: 'Reason' })
            },
            {
                dataIndex: 'count',
                key: 'count',
                title: intl.formatMessage({ id: 'Frequency' })
            },
            {
                dataIndex: 'firstTime',
                key: 'firstTime',
                title: intl.formatMessage({ id: 'FirstTime' })
            },
            {
                dataIndex: 'lastTime',
                key: 'lastTime',
                title: intl.formatMessage({ id: 'LastTime' })
            }
        ]
    }
    render() {
        const { intl, detail } = this.props
        const { tableData } = this.state
        const tableColumns = this.getColums()
        return (
            <div className='containerDetail_event'>
                <TableCommon
                    uniqueId='applicationCenter_container_event'
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

export default Event
