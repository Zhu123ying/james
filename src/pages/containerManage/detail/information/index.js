/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { container as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'

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
                title: intl.formatMessage({ id: 'Type' }),
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'status',
                key: 'status',
                title: intl.formatMessage({ id: 'Status' }),
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'message',
                key: 'message',
                title: intl.formatMessage({ id: 'Message' }),
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'reason',
                key: 'reason',
                title: intl.formatMessage({ id: 'Reason' }),
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'time',
                key: 'time',
                title: intl.formatMessage({ id: 'LastUpdateTime' }),
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            }
        ]
    }
    render() {
        const { intl, detail } = this.props
        const { tableData } = this.state
        const tableColumns = this.getColums()
        return (
            <div className='containerDetail_information'>
                <SearchBar
                    slot={() => (
                        <Popover
                            placement="bottomRight"
                            content={1}
                            overlayClassName="columns-setting-pop"
                            trigger="click"
                            type="detail"
                        >
                            <Tooltip placement="topRight" title={intl.formatMessage({ id: 'DiyColumnSetting' })}>
                                <Button size="middle-s" type="operate" icon="icon-setting" />
                            </Tooltip>
                        </Popover>
                    )}
                    onRefresh={this.getTableData}
                />
                <Table
                    pagination={false}
                    dataSource={tableData}
                    columns={tableColumns}
                ></Table>
            </div>
        )
    }
}

export default Information
