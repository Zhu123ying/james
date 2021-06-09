/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import TableCommon from '~/components/TableCommon'

class PullRecord extends React.Component {
    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
            name: '',
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            isFetching: false,
            tableData: []
        }
    }
    componentDidMount() {
        this.handleSearch()
    }
    handleSearch = () => {
        const { pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                id: this.props.id
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getImageArtifactTagRecords, params, {
            success: (res) => {
                this.setState({
                    tableData: res.data.datas,
                    total: res.data.total
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
                dataIndex: 'tagName',
                key: 'tagName',
                title: 'Tag',
            },
            {
                dataIndex: 'tagOperate',
                key: 'tagOperate',
                title: '操作',
                render(val){
                    return val ? '删除' : '添加'
                }
            },
            {
                dataIndex: 'createTime',
                key: 'createTime',
                title: '时间'
            },
            {
                dataIndex: 'createBy',
                key: 'createBy',
                title: '创建人'
            }
        ]
    }
    handleTableChange = ({ pageNumber, pageSize, name }) => {
        this.setState({
            pageNumber, pageSize, name
        }, () => {
            this.handleSearch()
        })
    }
    render() {
        const { intl } = this.props
        const { name, pageNumber, pageSize, total, tableData, isFetching } = this.state
        return (
            <div className='pullList'>
                <TableCommon
                    // searchOption={{
                    //     key: 'name',
                    //     title: intl.formatMessage({ id: 'Name' })
                    // }}
                    // params={{
                    //     pageNumber, pageSize, name
                    // }}
                    // paramsAlias={{
                    //     name: {
                    //         title: '名称'
                    //     }
                    // }}
                    uniqueId='ApplicationCenter_Image_PullList'
                    onRefresh={this.handleSearch}
                    columns={this.getColums()}
                    data={tableData}
                    checkable={false}
                    total={total}
                    onTableChange={this.handleTableChange}
                    loading={isFetching}
                />
            </div>
        )
    }
}

export default PullRecord
