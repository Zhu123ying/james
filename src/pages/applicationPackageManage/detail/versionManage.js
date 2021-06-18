/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification } from 'ultraui'
import '../index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { applicationPackage as api, application } from '~/http/api'
import { Collapse, Select, Button, Popover, Modal, Tabs, Table, ButtonGroup } from 'huayunui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import CreateVersion from './createVersion'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Card from '~/components/Card'
import CreateAppPort from './createAppPort'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
class VersionManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentVersion: _.get(props.applicationPackageVersionList, '0', {}),
            isVersionModalVisible: false, // 新增版本modal
            isPortManageModalVisible: false, // 入口modal
            portList: [], // 入口数据
            currentPort: {}, // 当前的入口对象
        }
    }
    componentDidMount() {
        this.getAppPackagePortData()
    }
    componentWillReceiveProps({ applicationPackageVersionList }) {
        // 判断是否要重新设置currentVersion
        const { currentVersion } = this.state
        const currentVersion_ = applicationPackageVersionList.find(item => item.id === currentVersion.id) || _.get(applicationPackageVersionList, '0', {})
        this.setState({
            currentVersion: currentVersion_
        })
        // 如果currentVersion变了，则需要重新获取入口数据
        currentVersion_.id !== currentVersion.id && this.getAppPackagePortData(currentVersion_.id)
    }
    // 获取入口列表数据
    getAppPackagePortData = (applicationVersionId = this.state.currentVersion.id) => {
        HuayunRequest(api.queryApplicationPackageVersionGateway, { applicationVersionId }, {
            success: (res) => {
                this.setState({
                    portList: res.data
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
    renderVersionInfoPanel = () => {
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
                        <Button type='primary' name={intl.formatMessage({ id: 'SubmitAppPackageVersion' })} onClick={() => this.handleSubmitVersion()} disabled={isCommit} />
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
    renderPortPanel = () => {
        const { intl } = this.props
        const { currentVersion, portList } = this.state
        return (
            <div className='portManage'>
                <Button
                    type="operate"
                    icon={<Icon type="add" />}
                    onClick={() => this.handleChange('isPortManageModalVisible', true)}
                    name="新增入口"
                    className='addBtn'
                    disabled={!currentVersion.isCommit}
                />
                <div className='portList'>
                    {
                        portList.map((item) => {
                            const { id, name, description, type, config } = item
                            return (
                                <Card handleDelete={() => this.handleDeletePort(id, name)} key={id}>
                                    <div className='portName'>{name}</div>
                                    <div className='portDes'>
                                        <span>{description}</span>
                                        <UltrauiButton
                                            type="text"
                                            onClick={() => this.handleManagePort(item)}
                                        >
                                            <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Manage' })}
                                        </UltrauiButton>
                                    </div>
                                    <div className='portKey'>
                                        <div className='title'>{intl.formatMessage({ id: 'AppPortObject' })}</div>
                                        <ButtonGroup className='keyContent'>
                                            <Button type="operate">{config.portKey}</Button>
                                            <Button type="message">{config.info}</Button>
                                        </ButtonGroup>
                                    </div>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    handleManagePort = (item) => {
        this.setState({
            currentPort: item,
            isPortManageModalVisible: true
        })
    }
    handlePortManageModalConfirm = () => {
        const { intl } = this.props
        const { currentPort: { id }, currentVersion: { id: applicationVersionId } } = this.state
        this.$CreateAppPort.props.form.validateFields((error, values) => {
            if (!error) {
                const { name, description, config, portKey } = this.$CreateAppPort.state
                const { type, resourceObjectId } = config
                config.portKey = portKey // 这个后端不需要，但是前端编辑赋初始值的时候需要
                const params = {
                    name, type, description, resourceObjectId, applicationVersionId, config, id
                }
                let urlType = id ? 'updateApplicationPackageVersionGateway' : 'createApplicationPackageVersionGateway'
                let action = id ? 'Update' : 'Create'
                HuayunRequest(api[urlType], params, {
                    success: (res) => {
                        this.setState({
                            isPortManageModalVisible: false
                        })
                        this.getAppPackagePortData() // 更新应用入口列表
                        notification.notice({
                            id: 'updateSuccess',
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${intl.formatMessage({ id: action })}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleDeletePort = (id, name) => {
        const { intl } = this.props
        const title = `${intl.formatMessage({ id: 'Delete' })}${intl.formatMessage({ id: 'ApplicationPort' })}`
        Modal.error({
            title,
            content: intl.formatMessage({ id: 'IsSureToDeleteAppPort' }),
            onOk: () => {
                HuayunRequest(application.deleteApplicationGateway, { id }, {
                    success: () => {
                        this.getAppPackagePortData() // 更新应用入口列表
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${title} - ${name} ${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    handleVersionManageModalConfirm = () => {
        this.$CreateVersion && this.$CreateVersion.handleSubmit()
    }
    // 因为提交创建版本的逻辑放在了子组件里，所以将创建成功的回调函数传过去，偷懒了
    hanleResponseStatus = () => {
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
        const { currentVersion: { id } } = this.state
        let data = { id }
        fetch(api.downApplicationPackageVersionChart, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then(res => res.blob().then(blob => {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
            var filename = res.headers.get('Content-Disposition').split('filename=')[1];
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }))
    }
    handleAddApplication = () => {
        const { currentVersion: { applicationPackageId, id: applicationPackageVersionId } } = this.state
        this.props.history.push(`/applicationCenter/applicationPackageManage/create?applicationPackageId=${applicationPackageId}&applicationPackageVersionId=${applicationPackageVersionId}`)
    }
    render() {
        const { intl, currentDataItem, applicationPackageVersionList } = this.props
        const { currentVersion, isVersionModalVisible, isPortManageModalVisible, currentPort } = this.state
        const tabOperation = {
            right: [
                <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleManageState}
                    >
                        <Icon type="listing" />&nbsp;{intl.formatMessage({ id: 'ManageStatement' })}
                    </UltrauiButton>
                </ActionAuth>,
                <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleDownload}
                        disabled={!currentVersion.isCommit}
                    >
                        <Icon type="download" />&nbsp;{intl.formatMessage({ id: 'DownloadStatement' })}
                    </UltrauiButton>
                </ActionAuth>,
                <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleAddApplication}
                    >
                        <Icon type="add" />&nbsp;{intl.formatMessage({ id: 'CreateApplication' })}
                    </UltrauiButton>
                </ActionAuth>
            ]
        }
        return (
            <div className='versionManage'>
                <Tabs defaultActiveKey="1" className='versionOperateBar' tabBarExtraContent={tabOperation}>
                    <TabPane tab={intl.formatMessage({ id: 'BasicInfo' })} key="1">
                        {this.renderVersionInfoPanel()}
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'Log' })} key="2">
                        log
                    </TabPane>
                    <TabPane tab={`${intl.formatMessage({ id: 'Manage' })}${intl.formatMessage({ id: 'Entrance' })}`} key="3">
                        {this.renderPortPanel()}
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
                        hanleResponseStatus={this.hanleResponseStatus}
                        wrappedComponentRef={node => this.$CreateVersion = node} />
                </Modal>
                <Modal
                    title={`${intl.formatMessage({ id: currentPort.id ? 'Update' : 'Create' })}${intl.formatMessage({ id: 'ApplicationPort' })}`}
                    visible={isPortManageModalVisible}
                    onOk={this.handlePortManageModalConfirm}
                    onCancel={() => this.handleChange('isPortManageModalVisible', false)}
                    className='createAppPortDialog'
                    destroyOnClose={true}
                >
                    <CreateAppPort
                        {...this.props}
                        currentVersion={currentVersion}
                        currentPort={currentPort}
                        wrappedComponentRef={node => this.$CreateAppPort = node} />
                </Modal>
            </div>
        )
    }
}

export default VersionManage
