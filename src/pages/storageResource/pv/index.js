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
        return [
            {
                dataIndex: 'applicationName',
                key: 'applicationName',
                title: intl.formatMessage({ id: 'Name' })
            },
            {
                dataIndex: 'STORAGECLASS',
                key: 'STORAGECLASS',
                title: '存储系统'
            },
            {
                dataIndex: 'RECLAIM',
                key: 'RECLAIM',
                title: '回收策略'
            },
            {
                dataIndex: 'accessModes',
                key: 'accessModes',
                title: '支持访问模式',
            },
            {
                dataIndex: 'accessModes',
                key: 'accessModes',
                title: '是否默认存储',
            },
            {
                dataIndex: 'accessModes',
                key: 'accessModes',
                title: '支持扩容',
            },
            {
                dataIndex: 'CAPACITY',
                key: 'CAPACITY',
                title: '最大容量',
            }
        ]
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
