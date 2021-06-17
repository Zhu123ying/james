/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { applicationPackage as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table } from 'huayunui'
import { Row, Col } from 'antd'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import VersionManage from './versionManage'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}
        }
    }
    componentWillReceiveProps({ currentDataItem }) {
        const { id } = currentDataItem
        id && id !== this.props.currentDataItem.id && this.getDetailData(id)
    }
    getDetailData = (id = this.props.currentDataItem.id) => {
        HuayunRequest(api.getApplicationPackage, { id }, {
            success: (res) => {
                const { applicationPackageVersionList } = res.data
                this.setState({
                    detail: res.data
                })
            }
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    handleManage = (id) => {
        this.props.history.push(`${this.props.match.path}/edit/${id}`)
    }
    handleShare = () => {

    }
    renderRecommendConfig = (quota) => {
        const { memory, cpu, storage } = quota || {}
        const storageLine = Object.keys(storage || {}).map(key => {
            return `${key}:${storage[key]}`
        })
        const array = [`CPU:${cpu} `, `Memory:${memory}`, ...storageLine]
        return <div className='quotaRecommand'>{array.join('|')}</div>
    }
    render() {
        const { intl, onClose, visible, currentDataItem, handleDelete } = this.props
        const { detail } = this.state
        const { id, name, projectName, tags, versionCount, updateTime, createTime, createByName, description, applicationPackageVersionList } = detail || {}
        const basicKeyValue = [
            {
                label: intl.formatMessage({ id: 'Name' }),
                value: name || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'ProjectBelongTo' }),
                value: projectName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Tag' }),
                value: (
                    <div className='labelList'>
                        {
                            (tags || []).map((item) => {
                                return (
                                    <TagItem
                                        size='small'
                                        key={item}
                                        name={item}
                                        className='tagWithoutClose'
                                    />
                                )
                            })
                        }
                    </div>
                )
            },
            {
                label: intl.formatMessage({ id: 'VersionCount' }),
                value: versionCount || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'UpdateTime' }),
                value: updateTime || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'CreaterName' }),
                value: createByName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'CreateTime' }),
                value: createTime || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Description' }),
                value: description || DEFAULT_EMPTY_LABEL
            }
        ]
        return (
            <DetailDrawer
                name={name}
                icon='log-1'
                onRefresh={this.getDetailData}
                onClose={onClose}
                visible={visible}
                className='applicationStoreDetailDrawer'
            >
                <div className='operaBar'>
                    <UltrauiButton
                        type="text"
                        onClick={() => this.handleManage(id)}
                        className='br'
                    >
                        <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'UpdateApplicationPackage' })}
                    </UltrauiButton>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleShare}
                    >
                        <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'ShareApplicationPackage' })}
                    </UltrauiButton>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="1">
                        <Collapse defaultActiveKey={['1']} className='basicInforCollapse'>
                            <Panel header={intl.formatMessage({ id: 'BasicInfo' })} key='1'>
                                <KeyValue values={basicKeyValue} className='basicKeyValue' />
                            </Panel>
                        </Collapse>
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'VersionManage' })} key="2">
                        <VersionManage
                            {...this.props}
                            getDetailData={this.getDetailData}
                            applicationPackageVersionList={applicationPackageVersionList}
                        />
                    </TabPane>
                </Tabs>
            </DetailDrawer >
        )
    }
}

export default Detail
