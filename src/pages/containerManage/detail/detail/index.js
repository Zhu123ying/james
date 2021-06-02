/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { application as api } from '~/http/api'
import HuayunRequest from '~/http/request'
import { DatePicker, Select, Input, Popover, Modal, ButtonGroup, Button, SearchBar, Table } from 'huayunui';
import { Icon, KeyValue, NoData } from 'ultraui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import './index.less'
import DetailIcon from '~/components/DetailIcon'

class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    getTableColums = () => {
        const { intl } = this.props
        const columns = [
            {
                dataIndex: 'name',
                title: intl.formatMessage({ id: 'ContainerName' }),
                render(val, row) {
                    return <a onClick={() => seeContainerDetail(row)}>{val}</a>
                }
            },
            {
                dataIndex: 'status',
                title: intl.formatMessage({ id: 'Status' }),
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'type',
                title: `${intl.formatMessage({ id: 'Container' })}${intl.formatMessage({ id: 'Type' })}`,
                render(val) {
                    return val || DEFAULT_EMPTY_LABEL
                }
            },
            {
                dataIndex: 'image',
                title: intl.formatMessage({ id: 'Image' }),
                render(image) {
                    const { project, repo, tag } = image
                    const arr = [project, repo, tag].filter(item => !!item)
                    return arr.join('/')
                }
            }
        ]
        return columns
    }
    seeContainerDetail = (row) => {

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
    render() {
        const { intl, detail, getDetail } = this.props
        const { id, containers, configurations } = detail
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
                                        <div className='contentItem configurationItem'>
                                            <div className='configurationInfo'>
                                                <DetailIcon iconType="log" className="m-r-sm" />
                                                <KeyValue values={this.getConfigurationItemData(item)} />
                                            </div>
                                            <a>查看</a>
                                        </div>
                                    )
                                }) : <NoData />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Detail
