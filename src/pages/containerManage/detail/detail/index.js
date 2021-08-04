/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Popover, Modal, ButtonGroup, Button, SearchBar, Table } from 'huayunui';
import { Icon, KeyValue, NoData, TagItem } from 'ultraui'
import { DEFAULT_EMPTY_LABEL, ContainerStateList } from '~/constants'
import './index.less'
import DetailIcon from '~/components/DetailIcon'
import ContainerDetail from './containerDetail'

// 容器配置文件的状态对照
const ContainerConfigFileStateObject = {
    config: '配置中',
    running: '正常',
    error: '异常',
    unknown: '未知'
}

// 容器持久存储的状态对照
const ContainerStorageStateObject = {
    config: '配置中',
    pending: '等待中',
    bound: '已绑定',
    lost: '丢失',
    error: '异常',
    unknown: '未知'
}

// 容器类型
const ContainerTypeObj = {
    ApplicationContainer: '应用容器',
    InitContainer: '初始化容器'
}
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isContainerDetailModalVisible: false,
            currentContainer: {},
        }
    }
    renderDetailPopover = (item) => {
        const { intl } = this.props
        const { name, labels, type, subType, data, status } = item
        const infor = [
            {
                label: intl.formatMessage({ id: 'Name' }),
                value: name
            },
            {
                label: intl.formatMessage({ id: 'Status' }),
                value: status
            },
            {
                label: intl.formatMessage({ id: 'Type' }),
                value: type
            },
            {
                label: intl.formatMessage({ id: 'Tag' }),
                value: (
                    <div className='labelList'>
                        {
                            labels && Object.keys(labels).map((key, index) => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={key}
                                        name={
                                            <div className='labelItem'>
                                                <span className='key'>{key}</span>
                                                <span className='splitLine'>|</span>
                                                <span className='value'>{labels[key]}</span>
                                            </div>
                                        }
                                    />
                                )
                            })
                        }
                    </div>
                )
            },
            {
                label: intl.formatMessage({ id: 'SubType' }),
                value: subType
            },
            {
                label: intl.formatMessage({ id: 'Data' }),
                value: (
                    <div className='labelList'>
                        {
                            data && Object.keys(data).map((key, index) => {
                                return (
                                    <TagItem
                                        size='medium'
                                        key={key}
                                        name={
                                            <div className='labelItem'>
                                                <span className='key'>{key}</span>
                                                <span className='splitLine'>|</span>
                                                <span className='value'>{data[key]}</span>
                                            </div>
                                        }
                                    />
                                )
                            })
                        }
                    </div>
                )
            },
        ]
        return (
            <div className='configDetail'>
                <div className='title'>配置文件</div>
                <KeyValue values={infor} />
            </div>
        )
    }
    getTableColums = () => {
        const { intl } = this.props
        const columns = [
            {
                dataIndex: 'name',
                title: intl.formatMessage({ id: 'ContainerName' }),
                render: (val, row) => {
                    return <a onClick={() => this.seeContainerDetail(row)}>{val}</a>
                }
            },
            {
                dataIndex: 'status',
                title: intl.formatMessage({ id: 'Status' }),
                render(status) {
                    return ContainerStateList[status] || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'type',
                title: `${intl.formatMessage({ id: 'Container' })}${intl.formatMessage({ id: 'Type' })}`,
                render(type) {
                    return ContainerTypeObj[type] || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'imagePath',
                title: intl.formatMessage({ id: 'Image' })
            }
        ]
        return columns
    }
    seeContainerDetail = (row) => {
        this.setState({
            currentContainer: row,
            isContainerDetailModalVisible: true
        })
    }
    getConfigurationItemData = (item) => {
        const { intl } = this.props
        const { name, type } = item
        return [
            {
                label: intl.formatMessage({ id: 'Name' }),
                value: name || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Type' }),
                value: type || DEFAULT_EMPTY_LABEL
            }
        ]
    }
    getStorageItemData = (item) => {
        const { intl } = this.props
        const { typeClass, capacity, accessMode, platformContainerId, recycleStrategy } = item
        return [
            {
                label: intl.formatMessage({ id: 'Usage' }),
                value: capacity
            },
            {
                label: intl.formatMessage({ id: 'Type' }),
                value: typeClass || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'AccessMode' }),
                value: accessMode || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'RecyclingStrategy' }),
                value: recycleStrategy || DEFAULT_EMPTY_LABEL
            }
        ]
    }
    handleSetState = (key, value) => {
        this.setState({
            [key]: value
        })
    }
    render() {
        const { intl, detail, getDetail, monitorData } = this.props
        const { id, containers, configurations, storages } = detail
        const { isContainerDetailModalVisible, currentContainer } = this.state
        return (
            <div className='containerDetail_infor'>
                <div className='containerDetail'>
                    <div className='title activeBefore'>容器详情</div>
                    <SearchBar
                        onRefresh={() => getDetail(id)}
                        slot={() => {
                            return <span className='total'>容器总计&nbsp;<span className='totalNum'>{containers.length}</span></span>
                        }}
                    />
                    <Table
                        pagination={false}
                        dataSource={containers}
                        columns={this.getTableColums()}
                        bordered
                    ></Table>
                </div>
                <div className='associatedResources'>
                    <div className='title activeBefore'>关联资源</div>
                    <div className='resourceItem'>
                        <div className='resourceTitle'>配置文件</div>
                        <div className='resourceContent configurationList'>
                            {
                                configurations.length ? configurations.map(item => {
                                    return (
                                        <div className='contentItem configurationItem' key={item.name}>
                                            <div className='configurationInfo'>
                                                <DetailIcon iconType="log" className="m-r-sm" />
                                                <KeyValue values={this.getConfigurationItemData(item)} />
                                                <span className='configState'>{ContainerConfigFileStateObject[item.status]}</span>
                                            </div>
                                            <Popover
                                                placement="right"
                                                content={this.renderDetailPopover(item)}
                                                trigger="click"
                                                type="text"
                                                getPopupContainer={() => document.querySelector('.containerDetail_infor')}
                                                id='detailPopover'>
                                                <a>查看</a>
                                            </Popover>
                                        </div>
                                    )
                                }) : <NoData />
                            }
                        </div>
                    </div>
                    <div className='resourceItem'>
                        <div className='resourceTitle'>持久存储</div>
                        <div className='resourceContent storageList'>
                            {
                                storages.length ? storages.map(item => {
                                    return (
                                        <div className='contentItem storageItem'>
                                            <div className='storageName'>
                                                <span>{item.name}</span>
                                                <span className='storageState'>{ContainerStorageStateObject[item.status]}</span>
                                            </div>
                                            <KeyValue values={this.getStorageItemData(item)} />
                                        </div>
                                    )
                                }) : <NoData />
                            }
                        </div>
                    </div>
                </div>
                <ContainerDetail
                    intl={intl}
                    platformContainerId={id}
                    currentContainer={currentContainer}
                    visible={isContainerDetailModalVisible}
                    getDetail={getDetail}
                    monitorData={_.get(monitorData, currentContainer.name, {})}
                    onClose={() => this.handleSetState('isContainerDetailModalVisible', false)}
                ></ContainerDetail>
            </div>
        )
    }
}

export default Detail
