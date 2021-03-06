/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { image as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, SearchBar, Button, Table, Modal, Space, Checkbox, Popover, Tooltip, message } from 'huayunui'
import { Icon, NoData, Notification } from 'ultraui'
import './index.less'
import TableCommon from '~/components/TableCommon'
import DetailIcon from '~/components/DetailIcon'
import ImageInstanceDetail from '../imageInstanceDetail'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DEFAULT_EMPTY_LABEL } from '~/constants'

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
                        <div className='imageInstanceName'>
                            <DetailIcon iconType="log-1" className="m-r-sm" />
                            <a onClick={() => this.seeImageInstanceDetail(row)} >{value}&nbsp;</a>
                            <CopyToClipboard
                                text={row.artifactDigestPath}	//点击复制时的内容,可自行设置或传入
                                onCopy={() => message.success('复制成功!')}		//点击之后的回调
                            >
                                <i className='iconfont icon-copy' key="copy"></i>
                            </CopyToClipboard>
                        </div>
                    )
                }
            },
            {
                dataIndex: 'tags',
                key: 'tags',
                title: 'Tag',
                render: (tags, row) => {
                    const { artifactTagPath } = row
                    return (
                        <div className='imageInstanceTag'>
                            {
                                tags ? (
                                    tags.map((tag, index) => {
                                        return (
                                            <div className='tagItem'>
                                                <span>{tag.name}&nbsp;</span>
                                                <CopyToClipboard
                                                    text={`${artifactTagPath}${tag.name}`}	//点击复制时的内容,可自行设置或传入
                                                    onCopy={() => message.success('复制成功!')}		//点击之后的回调
                                                >
                                                    <i className='iconfont icon-copy' key="copy"></i>
                                                </CopyToClipboard>
                                                {index === (tags.length - 1) ? '' : ` 、 `}
                                            </div>
                                        )
                                    })
                                ) : DEFAULT_EMPTY_LABEL
                            }
                        </div>
                    )
                }
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
                        title: intl.formatMessage({ id: 'Tag' })
                    }}
                    params={{
                        pageNumber, pageSize, name
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
