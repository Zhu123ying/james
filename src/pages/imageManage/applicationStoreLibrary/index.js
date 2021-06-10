/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import TableCommon from '~/components/TableCommon'
import DetailIcon from '~/components/DetailIcon'
import ImageInstanceList from './imageInstanceList'

const notification = Notification.newInstance()

class ApplicationStoreLibrary extends React.Component {
    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
            name: '',
            pageNumber: 1,
            pageSize: 10,
            total: 0,
            isFetching: false,
            tableData: [],
            tableType: 0,  // 用于区分是镜像仓库列表还是镜像实例列表，0和1
            currentTableItem: {},  // 仓库列表当前操作的行数据
        }
        this.operationTarget = intl.formatMessage({ id: 'AppStoreLibrary' })
    }
    componentDidMount() {
        this.handleSearch()
    }
    handleSearch = () => {
        const { name: imageRepoName, pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                imageRepoName
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getStoreRepoImageRepoList, params, {
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
                dataIndex: 'repoName',
                key: 'repoName',
                title: intl.formatMessage({ id: 'Name' }),
                render: (value, row) => {
                    return (
                        <>
                            <DetailIcon iconType="warehouse" className="m-r-sm" />
                            <a onClick={() => this.handleChangeTableType(row, 1)}>{value}</a>
                        </>
                    )
                }
            },
            {
                dataIndex: 'imageCount',
                key: 'imageCount',
                title: intl.formatMessage({ id: 'ImageCount' })
            },
            {
                dataIndex: 'pullCount',
                key: 'pullCount',
                title: intl.formatMessage({ id: 'PullCount' })
            },
            {
                dataIndex: 'updateTime',
                key: 'updateTime',
                title: intl.formatMessage({ id: 'LastUpdateTime' })
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
    handleChangeTableType = (row, type) => {
        this.setState({
            tableType: type,
            currentTableItem: row
        })
    }
    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl } = this.props
        const { name, pageNumber, pageSize, total, tableData, isFetching, tableType, currentTableItem } = this.state
        return (
            <div className='ApplicationStoreLibrary'>
                {
                    tableType === 0 ? (
                        <>
                            <TableCommon
                                searchOption={{
                                    key: 'name',
                                    title: intl.formatMessage({ id: 'Name' })
                                }}
                                params={{
                                    pageNumber, pageSize, name
                                }}
                                paramsAlias={{
                                    name: {
                                        title: '名称'
                                    }
                                }}
                                uniqueId='ApplicationCenter_Image_ApplicationStoreLibrary'
                                onRefresh={this.handleSearch}
                                columns={this.getColums()}
                                data={tableData}
                                checkable={false}
                                total={total}
                                onTableChange={this.handleTableChange}
                                loading={isFetching}
                            />
                        </>
                    ) : <ImageInstanceList
                        currentTableItem={currentTableItem}
                        handleChangeTableType={this.handleChangeTableType}
                        intl={intl} />
                }
            </div>
        )
    }
}

export default ApplicationStoreLibrary
