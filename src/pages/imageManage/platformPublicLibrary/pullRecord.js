/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import TableCommon from '~/components/TableCommon'
import { DEFAULT_EMPTY_LABEL } from '~/constants'

const pullStatusObj = {
    0: '拉取中',
    1: '拉取失败',
    2: '推送中',
    3: '推送失败',
    4: '拉取成功'
}
class PullRecord extends React.Component {
    constructor(props) {
        super(props)
        const { intl } = props
        this.state = {
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
            conditions: {}
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getPubRepoImagePullTaskList, params, {
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
                dataIndex: 'projectName',
                key: 'projectName',
                title: intl.formatMessage({ id: 'ProjectBelongTo' }),
            },
            {
                dataIndex: 'sourceRepoName',
                key: 'sourceRepoName',
                title: '来源仓库'
            },
            {
                dataIndex: 'sourceImage',
                key: 'sourceImage',
                title: '源镜像'
            },
            {
                dataIndex: 'targetImage',
                key: 'targetImage',
                title: '目标镜像'
            },
            {
                dataIndex: 'createByName',
                key: 'createByName',
                title: '创建人'
            },
            {
                dataIndex: 'pullStatus',
                key: 'pullStatus',
                title: '拉取状态',
                render(status, row) {
                    return (
                        <>
                            {pullStatusObj[status]}&nbsp;
                            {
                                status === 1 || status === 3 ? (
                                    <Popover
                                        type='text'
                                        content={row.pullErrorInfo}
                                        getPopupContainer={() => document.querySelector('.pullRecordList')}
                                    >
                                        <i className='iconfont icon-warning-o text-danger' ></i>
                                    </Popover>
                                ) : null
                            }
                        </>
                    )
                }
            },
            {
                dataIndex: 'createTime',
                key: 'createTime',
                title: '执行时间'
            }
        ]
    }
    handleTableChange = ({ pageNumber, pageSize }) => {
        this.setState({
            pageNumber, pageSize
        }, () => {
            this.handleSearch()
        })
    }
    render() {
        const { intl } = this.props
        const { pageNumber, pageSize, total, tableData, isFetching } = this.state
        return (
            <div className='pullRecordList'>
                <TableCommon
                    params={{
                        pageNumber, pageSize
                    }}
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
