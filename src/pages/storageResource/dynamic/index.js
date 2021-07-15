/* eslint-disable */
import React from 'react'
import { resource as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import TableCommon from '~/components/TableCommon'

class DynamicList extends React.Component {
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
        HuayunRequest(api.listClusterResourceStorageClass, {}, {
            success: (res) => {
                this.setState({
                    totalData: res.data,
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
                dataIndex: 'name',
                key: 'name',
                title: intl.formatMessage({ id: 'Name' })
            },
            {
                dataIndex: 'storageBackend',
                key: 'storageBackend',
                title: '存储系统'
            },
            {
                dataIndex: 'reclaimPolicy',
                key: 'reclaimPolicy',
                title: '回收策略'
            },
            {
                dataIndex: 'accessModes',
                key: 'accessModes',
                title: '支持访问模式',
                render(accessModes) {
                    return (accessModes || []).join('、')
                }
            },
            {
                dataIndex: 'isDefault',
                key: 'isDefault',
                title: '是否默认存储',
            },
            {
                dataIndex: 'allowVolumeExpansion',
                key: 'allowVolumeExpansion',
                title: '支持扩容',
            },
            {
                dataIndex: 'capacity',
                key: 'capacity',
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
        const tableData = _.cloneDeep(totalData).splice((pageNumber - 1) * pageSize, pageSize)
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

export default DynamicList
