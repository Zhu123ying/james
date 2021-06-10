/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip } from 'huayunui';
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import TableCommon from '~/components/TableCommon'
import DetailIcon from '~/components/DetailIcon'
import ImageInstanceDetail from '../imageInstanceDetail'

const notification = Notification.newInstance()

class ImageInstanceList extends React.Component {
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
            isDetailModalVisible: false,
            currentImageInstance: {}, // 当前镜像实例
        }
        this.operationTarget = intl.formatMessage({ id: 'ImageInstance' })
    }
    componentDidMount() {
        this.handleSearch()
    }
    handleSearch = () => {
        const { currentTableItem: { repoId: imageRepoId, repoName: imageRepoName }, url } = this.props
        const { name: tag, pageNumber, pageSize } = this.state
        const params = {
            pageNumber,
            pageSize,
            conditions: {
                tag,
                imageRepoName,
                imageRepoId
            }
        }
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.getStoreRepoImageArtifactList, params, {
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
                dataIndex: 'digest',
                key: 'digest',
                title: 'ID',
                render: (value, row) => {
                    return (
                        <>
                            <DetailIcon iconType="log-1" className="m-r-sm" />
                            <a onClick={() => this.seeImageInstanceDetail(row)}>{value}</a>
                        </>
                    )
                }
            },
            {
                dataIndex: 'artifactTagName',
                key: 'artifactTagName',
                title: 'Tag'
            },
            {
                dataIndex: 'summary',
                key: 'summary',
                title: '漏洞'
            },
            {
                dataIndex: 'pushTime',
                key: 'pushTime',
                title: '推送时间'
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
    seeImageInstanceDetail = (row) => {
        this.setState({
            isDetailModalVisible: true,
            currentImageInstance: row,
        })
    }
    handleChange = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl, handleChangeTableType } = this.props
        const { name, pageNumber, pageSize, total, tableData, isFetching, isDetailModalVisible, currentImageInstance } = this.state
        return (
            <div className='ImageInstanceList'>
                <a onClick={() => handleChangeTableType({}, 0)} className='goBack'>{`< 返回`}</a>
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
                    uniqueId='ApplicationCenter_Image_ImageInstanceList'
                    onRefresh={this.handleSearch}
                    columns={this.getColums()}
                    data={tableData}
                    checkable={false}
                    total={total}
                    onTableChange={this.handleTableChange}
                    loading={isFetching}
                />
                <ImageInstanceDetail
                    intl={intl}
                    repoType='applicationStore'
                    currentImageInstance={currentImageInstance}
                    visible={isDetailModalVisible}
                    onClose={() => this.handleChange('isDetailModalVisible', false)}
                    handleDelete={() => this.handleDelete([currentImageInstance.id], true)}
                ></ImageInstanceDetail>
            </div >
        )
    }
}

export default ImageInstanceList
