/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification } from 'ultraui'
import '../index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { applicationPackage as api } from '~/http/api'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table } from 'huayunui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import CreateVersion from './createVersion'
const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
class VersionManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentVersion: _.get(props.applicationPackageVersionList, '0', {}),
            isVersionModalVisible: false
        }
    }
    componentWillReceiveProps({ applicationPackageVersionList }) {
        // 判断是否要重新设置currentVersion
        const { currentVersion } = this.state
        this.setState({
            currentVersion: applicationPackageVersionList.find(item => item.id === currentVersion.id) || _.get(applicationPackageVersionList, '0', {})
        })
    }
    handleChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    renderRecommendConfig = (quota) => {
        if (!quota) {
            return DEFAULT_EMPTY_LABEL
        }
        const { memory, cpu, storage } = quota || {}
        const storageLine = Object.keys(storage || {}).map(key => {
            return `${key}:${storage[key]}`
        })
        const array = [`CPU:${cpu} `, `Memory:${memory}`, ...storageLine]
        return <div className='quotaRecommand'>{array.join('|')}</div>
    }
    renderVersionInfo = () => {
        const { intl } = this.props
        const { currentVersion } = this.state
        const { name, description, packageVersion, quota, createBy, createTime, chartValues, chartTemplate, isCommit } = currentVersion
        const versionKeyValueData = [
            {
                label: intl.formatMessage({ id: 'Index of versions' }),
                value: packageVersion || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'Recommended Configuration' }),
                value: this.renderRecommendConfig(quota)
            }
        ]
        const versionKeyValueData2 = [
            {
                value: intl.formatMessage({ id: 'CreaterName' }),
                label: createBy || DEFAULT_EMPTY_LABEL
            },
            {
                value: intl.formatMessage({ id: 'CreateTime' }),
                label: createTime || DEFAULT_EMPTY_LABEL
            }
        ]
        return (
            <>
                <div className='versionInfo'>
                    <div className='p16'>
                        <div className='versionName'>
                            {name || DEFAULT_EMPTY_LABEL}&nbsp;&nbsp;
                            <Button type={isCommit ? 'success' : 'operate'} name={isCommit ? '已提交' : '未提交'} size='small-s' />
                        </div>
                        <div className='versionDes'>{description || DEFAULT_EMPTY_LABEL}</div>
                        <KeyValue values={versionKeyValueData} />
                    </div>
                    <div className='horizontalKeyValue'>
                        <KeyValue values={versionKeyValueData2} />
                        <Button type='primary' name={intl.formatMessage({ id: 'SubmitAppPackageVersion' })} onClick={() => this.handleSubmitVersion()} />
                    </div>
                </div>
                <Tabs defaultActiveKey="1" className='versionChart'>
                    <TabPane tab='VALUES' key="1">
                        {chartValues}
                    </TabPane>
                    <TabPane tab='TEMPLATE' key="2">
                        {chartTemplate}
                    </TabPane>
                </Tabs>
            </>
        )
    }
    handleVersionManageModalConfirm = () => {
        this.$CreateVersion && this.$CreateVersion.handleSubmitCreateVersion()
        this.props.getDetailData()
        this.setState({
            isVersionModalVisible: false
        })
    }
    handleDelete = (ids) => {
        const { intl, getDetailData } = this.props
        const action = intl.formatMessage({ id: 'Delete' })
        Modal.error({
            content: `${intl.formatMessage({ id: 'IsSureToDelete' }, { name: intl.formatMessage({ id: 'AppPackageVersion' }) })}`,
            onOk: () => {
                HuayunRequest(api.deleteApplicationPackageVersion, { ids }, {
                    success(res) {
                        getDetailData()
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${action}${intl.formatMessage({ id: 'AppPackageVersion' })}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleSubmitVersion = () => {
        const { currentVersion: { id } } = this.state
        Modal.confirm({
            content: '确认提交该应用包版本吗？',
            onOk: () => {
                HuayunRequest(api.updateApplicationPackageVersionChartCommit, { id }, {
                    success(res) {
                        getDetailData()
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${intl.formatMessage({ id: 'Submit' })}${intl.formatMessage({ id: 'AppPackageVersion' })}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleManageState = () => {

    }
    handleDownload = () => {

    }
    handleAddApplication = () => {
        const { currentVersion: { applicationPackageId, id: applicationPackageVersionId } } = this.state
        this.props.history.push(`/applicationCenter/applicationPackageManage/create?applicationPackageId=${applicationPackageId}&applicationPackageVersionId=${applicationPackageVersionId}`)
    }
    render() {
        const { intl, currentDataItem, applicationPackageVersionList } = this.props
        const { currentVersion, isVersionModalVisible } = this.state
        const tabOperation = {
            right: [
                <UltrauiButton
                    type="text"
                    onClick={this.handleManageState}
                >
                    <Icon type="listing" />&nbsp;{intl.formatMessage({ id: 'ManageStatement' })}
                </UltrauiButton>,
                <UltrauiButton
                    type="text"
                    onClick={this.handleDownload}
                >
                    <Icon type="download" />&nbsp;{intl.formatMessage({ id: 'DownloadStatement' })}
                </UltrauiButton>,
                <UltrauiButton
                    type="text"
                    onClick={this.handleAddApplication}
                >
                    <Icon type="add" />&nbsp;{intl.formatMessage({ id: 'CreateApplication' })}
                </UltrauiButton>
            ]
        }
        return (
            <div className='versionManage'>
                <Tabs defaultActiveKey="1" className='versionOperateBar' tabBarExtraContent={tabOperation}>
                    <TabPane tab={intl.formatMessage({ id: 'BasicInfo' })} key="1">
                        {this.renderVersionInfo()}
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'Log' })} key="2">
                        log
                    </TabPane>
                    <TabPane tab={`${intl.formatMessage({ id: 'Manage' })}${intl.formatMessage({ id: 'Entrance' })}`} key="3">
                        Entrance
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'Alarm' })} key="4">
                        Alarm
                    </TabPane>
                </Tabs>
                <div className='versionList'>
                    <div className='title'>
                        版本列表
                        <UltrauiButton
                            type="text"
                            onClick={() => this.handleChange('isVersionModalVisible', true)}
                            className='br'
                        >
                            <Icon type="add" />&nbsp;新增
                        </UltrauiButton>
                    </div>
                    <div className='listContent'>
                        {
                            (applicationPackageVersionList || []).map((item) => {
                                const { id, name, createTime, isCommit } = item
                                return (
                                    <div className='versionItem' key={id} onClick={() => this.handleChange('currentVersion', item)}>
                                        <span className={`versionName ${currentVersion.id === id ? 'activeBefore' : ''}`}>
                                            <div className='label'>
                                                <div className={`stateDot ${isCommit ? 'bg-success' : 'bg-default'}`}></div>
                                                {name}
                                            </div>
                                            <Icon type='error-o' onClick={() => this.handleDelete([id])} />
                                        </span>
                                        <span className='createTime'>{createTime}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <Modal
                    title={intl.formatMessage({ id: 'CreateAppPackageVersion' })}
                    visible={isVersionModalVisible}
                    onOk={this.handleVersionManageModalConfirm}
                    onCancel={() => this.handleChange('isVersionModalVisible', false)}
                    className='versionManageModal'
                    destroyOnClose={true}
                    width={440}
                >
                    <CreateVersion
                        {...this.props}
                        applicationPackageId={currentDataItem.id}
                        projectId={currentDataItem.projectId}
                        wrappedComponentRef={node => this.$CreateVersion = node} />
                </Modal>
            </div>
        )
    }
}

export default VersionManage
