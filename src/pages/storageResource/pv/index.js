/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { resource as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import TableCommon from '~/components/TableCommon'

class PvList extends React.Component {
    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
            pageNumber: 1,
            pageSize: 10,
            totalData: [],
            isFetching: false,
        }
    }
    componentDidMount() {
        this.handleSearch()
    }
    handleSearch = () => {
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.listClusterPVInfo, {}, {
            success: (res) => {
                this.setState({
                    totalData: res.data.persistentVolumeList,
                })
            },
            complete: (res) => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    getColums = () => {
        const { intl } = this.props
        return [ // 表格的列数组配置
            {
                dataIndex: 'name',
                key: 'name',
                columnType: 'name',
                title: `PV${intl.formatMessage({ id: 'Name' })}`
            }, {
                dataIndex: 'runInfo',
                key: 'applicationName',
                title: intl.formatMessage({ id: 'AppName' }),
                render(val, row) {
                    return _.get(val, 'applicationName', DEFAULT_EMPTY_LABEL)
                }
            }, {
                dataIndex: 'type',
                key: 'type',
                title: 'Type',
            }, {
                dataIndex: 'runInfo',
                key: 'CAPACITY',
                title: intl.formatMessage({ id: 'Capacity' }),
                render(val, row) {
                    let num = _.get(val, 'CAPACITY.storage.number', 0)
                    return num ? `${parseFloat(num) / 1024 / 1024 / 1024}G` : DEFAULT_EMPTY_LABEL
                }
            }, {
                dataIndex: 'runInfo',
                key: 'ACCESS MODES',
                title: 'ACCESS MODES',
                render: (val, row) => {
                    return _.get(val, 'accessModes', []).join('、')
                }
            }, {
                dataIndex: 'runInfo',
                key: 'RECLAIM POLICY',
                title: 'RECLAIM POLICY',
                render: (val, row) => {
                    return _.get(val, 'RECLAIM POLICY', '') || DEFAULT_EMPTY_LABEL
                }
            }, {
                dataIndex: 'runInfo',
                key: 'VOLUME MODES',
                title: 'VOLUME MODES',
                render: (val, row) => {
                    return _.get(val, 'VolumeMode', '') || DEFAULT_EMPTY_LABEL
                }
            }, {
                dataIndex: 'runInfo',
                key: 'STATUS',
                title: intl.formatMessage({ id: 'Status' }),
                render(val, row) {
                    return _.get(val, 'STATUS', '') || DEFAULT_EMPTY_LABEL
                }
            }, {
                dataIndex: 'runInfo',
                key: 'CLAIM',
                title: 'CLAIM',
                render: (val, row) => {
                    return _.get(val, 'CLAIM', '') || DEFAULT_EMPTY_LABEL
                }
            }, {
                dataIndex: 'runInfo',
                key: 'STORAGECLASS',
                title: 'STORAGECLASS',
                render: (val, row) => {
                    return _.get(val, 'STORAGECLASS', '') || DEFAULT_EMPTY_LABEL
                }
            }, {
                dataIndex: 'runInfo',
                key: 'REASON',
                title: 'REASON',
                render: (val, row) => {
                    return _.get(val, 'REASON', '') || DEFAULT_EMPTY_LABEL
                }
            }, {
                dataIndex: 'createTime',
                key: 'createTime',
                title: intl.formatMessage({ id: 'CreateTime' })
            }, {
                title: intl.formatMessage({ id: 'Operate' }),
                key: 'Operate',
                render: (id, row) => {
                    const options = [
                        {
                            name: intl.formatMessage({ id: 'ReadStatementInfor' }),
                            callback: () => {
                                this.readStatementInfor(row)
                            }
                        }
                    ]
                    return (
                        <Dropdown title="" icon="more" btnSize="small" options={options} btnType="text" placement='bottomRight' />
                    )
                }
            }
        ]
    }
    readStatementInfor = (row) => {

    }
    handleTableChange = ({ pageNumber, pageSize }) => {
        this.setState({
            pageNumber, pageSize
        })
    }
    render() {
        const { intl } = this.props
        const { pageNumber, pageSize, totalData, isFetching } = this.state
        const tableData = totalData.splice(pageNumber * pageSize, pageSize)

        return (
            <TableCommon
                uniqueId='ApplicationCenter_StorageResource_PvList'
                onRefresh={this.handleSearch}
                columns={this.getColums()}
                data={tableData}
                checkable={false}
                total={totalData.length}
                onTableChange={this.handleTableChange}
                loading={isFetching}
            />
        )
    }
}

export default PvList
