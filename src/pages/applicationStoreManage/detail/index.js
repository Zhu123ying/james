/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, Input, Button as UltrauiButton, KeyValue, TagItem, Notification, NoData } from 'ultraui'
import './index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { applicationStore as api } from '~/http/api'
import DetailDrawer from '~/components/DetailDrawer'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table } from 'huayunui'
import { Row, Col } from 'antd'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import { formatChartValues } from '~/pages/utils'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
class Detail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isFetching: false,
            detail: {},
            currentVersion: {}
        }
    }
    componentWillReceiveProps({ currentDataItem }) {
        const { id } = currentDataItem
        id && id !== this.props.currentDataItem.id && this.getDetailData(id)
    }
    getDetailData = (id = this.props.currentDataItem.id) => {
        this.setState({
            isFetching: true
        })
        HuayunRequest(api.detail, { id }, {
            success: (res) => {
                const { applicationPackageVersionStoreList } = res.data
                const initVersionId = _.get(applicationPackageVersionStoreList, '0.id', '')
                this.setState({
                    detail: res.data
                })
                this.handleSelectVersion(initVersionId)
            },
            complete: () => {
                this.setState({
                    isFetching: false
                })
            }
        })
    }
    handleSelectVersion = (id) => {
        if (!id) return
        HuayunRequest(api.getApplicationPackageVersionStoreInfo, { id }, {
            success: (res) => {
                this.setState({
                    currentVersion: res.data
                })
            }
        })
    }
    handleManage = (id) => {
        this.props.history.push(`${this.props.match.path}/edit/${id}`)
    }
    renderRecommendConfig = (quota) => {
        const { memory, cpu, storage } = quota || {}
        const storageLine = Object.keys(storage || {}).map(key => {
            return `${key} : ${storage[key]}`
        })
        const array = [`CPU : ${cpu || DEFAULT_EMPTY_LABEL} `, `Memory : ${memory || DEFAULT_EMPTY_LABEL}`, ...storageLine]
        return <div className='quotaRecommand'>{array.join(' | ')}</div>
    }
    handleAddApplication = () => {
        const { currentVersion: { id: applicationPackageVersionId } } = this.state
        const { currentDataItem: { id } } = this.props
        this.props.history.push(`/applicationCenter/applicationManage/create?id=${id}&applicationPackageVersionId=${applicationPackageVersionId}`)
    }
    render() {
        const { intl, onClose, visible, currentDataItem, handleDelete } = this.props
        const { detail, currentVersion, isFetching } = this.state
        const { id, name, tags, createTime, description, applicationPackageVersionStoreList } = detail || {}
        const basicKeyValue = [
            {
                label: intl.formatMessage({ id: 'Name' }),
                value: name || DEFAULT_EMPTY_LABEL
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
                label: intl.formatMessage({ id: 'CreateTime' }),
                value: createTime || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Description' }),
                value: description || DEFAULT_EMPTY_LABEL
            }
        ]
        const versionKeyValueData = [
            {
                label: intl.formatMessage({ id: 'Index of versions' }),
                value: currentVersion.packageVersion || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Recommended Configuration' }),
                value: this.renderRecommendConfig(currentVersion.quota)
            }
        ]
        const versionKeyValueData2 = [
            {
                value: intl.formatMessage({ id: 'CreaterName' }),
                label: currentVersion.createByName || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'CreateTime' }),
                label: currentVersion.createTime || DEFAULT_EMPTY_LABEL
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
                {
                    isFetching ? <Loading /> : (
                        <>
                            <ActionAuth action={actions.AdminApplicationCenterApplicationCenterOperate}>
                                <div className='operaBar'>
                                    <UltrauiButton
                                        type="text"
                                        onClick={() => this.handleManage(id)}
                                        className='br'
                                    >
                                        <Icon type="release" />&nbsp;{intl.formatMessage({ id: '::Manage' })}
                                    </UltrauiButton>
                                    <UltrauiButton
                                        type="text"
                                        onClick={handleDelete}
                                    >
                                        <Icon type="empty" />&nbsp;{intl.formatMessage({ id: 'Delete' })}
                                    </UltrauiButton>
                                </div>
                            </ActionAuth>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={intl.formatMessage({ id: 'Detail' })} key="1">
                                    <Collapse defaultActiveKey={['1']} className='basicInforCollapse'>
                                        <Panel header={intl.formatMessage({ id: 'BasicInfo' })} key='1'>
                                            <KeyValue values={basicKeyValue} className='basicKeyValue' />
                                        </Panel>
                                    </Collapse>
                                </TabPane>
                                <TabPane tab={intl.formatMessage({ id: 'VersionManage' })} key="2">
                                    {
                                        Array.isArray(applicationPackageVersionStoreList) && applicationPackageVersionStoreList.length ? (
                                            <div className='versionManage'>
                                                <div className='versionContent'>
                                                    <div className='versionInfo'>
                                                        <div className='p16'>
                                                            <div className='versionName'>
                                                                {currentDataItem.name}
                                                                <ActionAuth action={actions.AdminApplicationCenterApplicationCenterApplicationCreate}>
                                                                    <UltrauiButton
                                                                        type="text"
                                                                        onClick={this.handleAddApplication}
                                                                    >
                                                                        <Icon type="add" />&nbsp;{intl.formatMessage({ id: 'CreateApplication' })}
                                                                    </UltrauiButton>
                                                                </ActionAuth>
                                                            </div>
                                                            <div className='versionDes'>{currentDataItem.description}</div>
                                                            <KeyValue values={versionKeyValueData} />
                                                        </div>
                                                        <KeyValue className='horizontalKeyValue' values={versionKeyValueData2} />
                                                    </div>
                                                    <Tabs defaultActiveKey="1" className='versionChart'>
                                                        <TabPane tab='VALUES' key="1">
                                                            <div className='chartValues' dangerouslySetInnerHTML={{ __html: formatChartValues(currentVersion.chartValues) }}></div>
                                                        </TabPane>
                                                        <TabPane tab='TEMPLATE' key="2">
                                                            <div className='chartValues' dangerouslySetInnerHTML={{ __html: formatChartValues(currentVersion.chartTemplate) }}></div>
                                                        </TabPane>
                                                    </Tabs>
                                                </div>
                                                <div className='versionList'>
                                                    <div className='title'>版本列表</div>
                                                    <div className='listContent'>
                                                        {
                                                            (applicationPackageVersionStoreList || []).map((item) => {
                                                                const { id, name, createTime } = item
                                                                return (
                                                                    <div className='versionItem' key={id} onClick={() => this.handleSelectVersion(id)}>
                                                                        <span className={`versionName ${currentVersion.id === id ? 'activeBefore' : ''}`}>{name}</span>
                                                                        <span className='createTime'>{createTime}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ) : <NoData />
                                    }
                                </TabPane>
                            </Tabs>
                        </>
                    )
                }
            </DetailDrawer >
        )
    }
}

export default Detail
