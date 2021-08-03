/* eslint-disable */
import React from 'react'
import { RcForm, Icon, Loading, SortTable, Dialog, Radio, Input, Button as UltrauiButton, KeyValue, TagItem, InlineInput, Notification, NoData } from 'ultraui'
import '../index.less'
import moment from 'moment'
import HuayunRequest from '~/http/request'
import { applicationPackage as api, application } from '~/http/api'
import { Collapse, Select, Button, Popover, Tabs, Table, ButtonGroup, Modal } from 'huayunui'
import { DEFAULT_EMPTY_LABEL } from '~/constants'
import CreateVersion from './createVersion'
import ActionAuth from '~/components/ActionAuth'
import actions from '~/constants/authAction'
import Card from '~/components/Card'
import CreateAppPort from './createAppPort'
import FileEdit from './fileEdit'
import AlarmConfig from './alarmConfig'
import LogManage from './createLog'
import { formatChartValues } from '~/pages/utils'

const _ = window._
const { Panel } = Collapse
const { TabPane } = Tabs
const notification = Notification.newInstance()
class VersionManage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentVersionId: _.get(props.applicationPackageVersionList, '0.id', ''),
            currentVersion: {},
            isVersionModalVisible: false, // 新增版本modal
            isPortManageModalVisible: false, // 入口modal
            isLogManageModalVisible: false, // 日志modal
            logList: [], // 日志数据
            currentLog: {}, // 当前的日志对象
            isStateManageModalVisible: false, // 文件树
            portList: [], // 入口数据
            currentPort: {}, // 当前的入口对象
            isAlarmConfigModalVisible: false, // 告警配置
            alarmDetail: {}, // 告警详情
            alarmTemplates: [], // 告警模板
            alarmContacts: [], // 告警联系人
            tabActiveKey: '1', // 当前激活的tab
        }
    }
    componentDidMount() {
        const { currentVersionId } = this.state
        // 获取版本的日志数据
        currentVersionId && this.getApplicationPackageVersionLogConfigs(currentVersionId)
        // 版本的详情
        currentVersionId && this.getApplicationPackageVersionInfo(currentVersionId)
        // 获取告警数据
        currentVersionId && this.getAlarmConfigData(currentVersionId)
        // 获取告警模板
        this.getAlarmTemplates()
        // 获取告警联系人
        this.getAlarmContacts()
    }
    componentWillReceiveProps({ applicationPackageVersionList }) {
        // 判断是否要重新设置currentVersionId
        const { currentVersionId } = this.state
        const currentVersion = applicationPackageVersionList.find(item => item.id === currentVersionId)
        if (!currentVersion) {
            const currentVersionId_ = _.get(applicationPackageVersionList, '0.id', '')
            // 如果没匹配的版本，要将currentVersion， portList， alarmDetail这些跟版本相关的数据先重置，然后再调接口赋值，否则切换应用包，在没有版本的情况下数据会保留先前的
            this.setState({
                currentVersionId: currentVersionId_,
                currentVersion: {},
                portList: [],
                alarmDetail: {},
                logList: []
            })
            currentVersionId_ && this.getApplicationPackageVersionLogConfigs(currentVersionId_)
            currentVersionId_ && this.getApplicationPackageVersionInfo(currentVersionId_)
            currentVersionId_ && this.getAlarmConfigData(currentVersionId_)
        }
    }
    // 获取日志
    getApplicationPackageVersionLogConfigs = (packageVersionId = this.state.currentVersionId) => {
        HuayunRequest(api.getApplicationPackageVersionLogConfigs, { packageVersionId }, {
            success: (res) => {
                this.setState({
                    logList: res.data || []
                })
            }
        })
    }
    // 获取告警模板
    getAlarmTemplates = () => {
        HuayunRequest(api.getApplicationPackageVersionAlarmTemplates, {}, {
            success: (res) => {
                this.setState({
                    alarmTemplates: res.data
                })
            }
        })
    }
    // 获取告警联系人
    getAlarmContacts = () => {
        HuayunRequest(api.getApplicationPackageVersionAlarmUsers, {}, {
            success: (res) => {
                this.setState({
                    alarmContacts: res.data
                })
            }
        })
    }
    // 获取告警数据
    getAlarmConfigData = (applicationPackageVersionId = this.state.currentVersionId) => {
        HuayunRequest(api.getApplicationPackageVersionAlarmConfig, { applicationPackageVersionId }, {
            success: (res) => {
                this.setState({
                    alarmDetail: res.data
                })
            }
        })
    }
    // 获取入口列表数据
    getAppPackagePortData = (applicationVersionId = this.state.currentVersionId) => {
        HuayunRequest(api.queryApplicationPackageVersionGateway, { applicationVersionId }, {
            success: (res) => {
                this.setState({
                    portList: res.data
                })
            }
        })
    }
    // 应用包详情切换版本信息
    getApplicationPackageVersionInfo = (id = this.state.currentVersionId) => {
        HuayunRequest(api.getApplicationPackageVersionInfo, { id }, {
            success: (res) => {
                this.setState({
                    currentVersion: res.data
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
        const { memory, cpu, eStorage, storage } = quota || {}
        const array = [`cpu:${cpu}(m)`, `memory:${memory}(Mi)`, `storage:${storage}(Gi)`, `临时存储:${eStorage}(Gi)`]
        return <div className='quotaRecommand'>{array.join(` | `)}</div>
    }
    renderVersionInfoPanel = () => {
        const { intl } = this.props
        const { currentVersion } = this.state
        const { id, name, description, packageVersion, quota, createByName, createTime, chartValues, chartTemplate, isCommit } = currentVersion
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
                label: createByName || DEFAULT_EMPTY_LABEL
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
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                            <Button type='primary' name={intl.formatMessage({ id: 'SubmitAppPackageVersion' })} onClick={() => this.handleSubmitVersion()} disabled={!id || isCommit} />
                        </ActionAuth>
                    </div>
                </div>
                <Tabs defaultActiveKey="1" className='versionChart'>
                    <TabPane tab='VALUES' key="1">
                        <div className='chartValueContent' dangerouslySetInnerHTML={{ __html: formatChartValues(currentVersion.chartValues) }}></div>
                    </TabPane>
                    <TabPane tab='TEMPLATE' key="2">
                        <div className='chartValueContent' dangerouslySetInnerHTML={{ __html: formatChartValues(currentVersion.chartTemplate) }}></div>
                    </TabPane>
                </Tabs>
            </>
        )
    }
    renderAlarmPanel = () => {
        const { intl, applicationPackageVersionList } = this.props
        const { alarmDetail, alarmTemplates, alarmContacts } = this.state
        const isStart = _.get(alarmDetail, 'isStart', 0) // 是否启用
        const templateId = _.get(alarmDetail, 'alarmTemplates.0.id', '') // 模板名称
        const contactIds = _.get(alarmDetail, 'notifyUsers', []) || []
        const templateName = (alarmTemplates.find(item => item.id === templateId) || {}).name
        const contactUsers = contactIds.map(item => {
            return alarmContacts.find(item_ => item.id === item_.id)
        })
        const keyValueData = [
            {
                label: intl.formatMessage({ id: 'AlarmStatus' }),
                value: (
                    <div className='editLine'>
                        <span>{isStart ? '启用' : '未启用'}</span>
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                            <UltrauiButton
                                type="text"
                                onClick={() => this.handleChange('isAlarmConfigModalVisible', true)}
                            >
                                <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Edit' })}
                            </UltrauiButton>
                        </ActionAuth>
                    </div>
                )
            },
            {
                label: intl.formatMessage({ id: 'AlarmTemplate' }),
                value: templateName || DEFAULT_EMPTY_LABEL
            },
            {
                label: intl.formatMessage({ id: 'AlarmContact' }),
                value: (
                    <div className='contactUsers'>
                        {
                            contactUsers.map(item => {
                                const { name, phone, email } = item || {}
                                const KeyValueData = [
                                    {
                                        label: intl.formatMessage({ id: 'Email' }),
                                        value: email || DEFAULT_EMPTY_LABEL
                                    },
                                    {
                                        label: intl.formatMessage({ id: 'Phone' }),
                                        value: phone || DEFAULT_EMPTY_LABEL
                                    }
                                ]
                                return (
                                    <div className='contactItem'>
                                        <div className='title'>{name}</div>
                                        <KeyValue values={KeyValueData} />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        ]
        return (
            <>
                {
                    applicationPackageVersionList && applicationPackageVersionList.length ? <KeyValue values={keyValueData} className='alarmConfig' /> : <NoData />
                }
            </>
        )
    }
    renderLogPanel = () => {
        const { intl } = this.props
        const { currentVersion, logList } = this.state
        return (
            <div className='logManage'>
                <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                    <Button
                        type="operate"
                        icon={<Icon type="add" />}
                        onClick={() => this.handleManageLog()}
                        name="新增日志"
                        className='addBtn'
                        disabled={!currentVersion.isCommit}
                    />
                </ActionAuth>
                <div className='logList'>
                    {
                        logList.map((item) => {
                            const { packageVersionId, logResource, isStandardLogConfig, isServiceLogConfig, standardLogConfig, serviceLogConfig, configId } = item
                            return (
                                <Card
                                    action={actions.AdminApplicationCenterApplicationPackageVersionOperate}
                                    handleDelete={() => this.handleDeleteLog(packageVersionId, configId)}
                                    key={configId}>
                                    <div className='logInfo'>
                                        <div className='logName'>{logResource.join('/')}</div>
                                        <div className='btnGroupList'>
                                            {
                                                isStandardLogConfig ? (
                                                    <ButtonGroup className='keyContent'>
                                                        <Button type="operate">日志标注输出</Button>
                                                        <Button type="message">{`${standardLogConfig.maxSize}Gi | ${standardLogConfig.expireTime}天`}</Button>
                                                    </ButtonGroup>
                                                ) : null
                                            }
                                            {
                                                isServiceLogConfig ? (
                                                    <ButtonGroup className='keyContent'>
                                                        <Button type="operate">服务日志</Button>
                                                        <Button type="message">{`${serviceLogConfig.maxSize}Gi | ${serviceLogConfig.expireTime}天 | ${serviceLogConfig.path}`}</Button>
                                                    </ButtonGroup>
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                    <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                                        <UltrauiButton
                                            type="text"
                                            onClick={() => this.handleManageLog(item)}
                                        >
                                            <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Edit' })}
                                        </UltrauiButton>
                                    </ActionAuth>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
    handleManageLog = (item = {}) => {
        this.setState({
            currentLog: item,
            isLogManageModalVisible: true
        })
    }
    handleLogManageModalConfirm = () => {
        const { intl } = this.props
        const { currentLog: { configId }, currentVersionId } = this.state
        let { cascaderSelectData, cascaderValue, isStandardLogConfig, standardLogConfig, isServiceLogConfig, serviceLogConfig } = this.$LogManage.state
        if (!cascaderValue.length) {
            this.$LogManage.handleChange('cascaderPanelErrorMessage', '请选择容器！')
        }
        this.$LogManage.props.form.validateFields((errs, values) => {
            if (errs || !cascaderValue) {
                return
            }
            let kind = cascaderSelectData.find(item => item.value === cascaderValue[0]).kind
            let containerName = cascaderValue[2]
            let podName = cascaderValue[1]
            let params = {
                podName,
                kind,
                containerName,
                isStandardLogConfig,
                standardLogConfig,
                isServiceLogConfig,
                serviceLogConfig,
                packageVersionId: currentVersionId,
                logResource: cascaderValue,
                configId
            }
            let content = `${intl.formatMessage({ id: configId ? 'Edit' : 'Add' })}${intl.formatMessage({ id: 'Log' })}`
            let urlType = configId ? 'updateApplicationPackageVersionLogConfig' : 'confirmApplicationPackageVersionLogConfig'
            HuayunRequest(api[urlType], params, {
                success: (res) => {
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${content}${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                    this.setState({
                        isLogManageModalVisible: false
                    })
                    this.getApplicationPackageVersionLogConfigs()
                }
            })
        })
    }
    handleDeleteLog = (packageVersionId, configId) => {
        const { intl } = this.props
        const title = `${intl.formatMessage({ id: 'Delete' })}${intl.formatMessage({ id: 'Log' })}`
        Modal.error({
            content: intl.formatMessage({ id: 'IsSureToDelete' }, { name: intl.formatMessage({ id: 'Log' }) }),
            onOk: () => {
                HuayunRequest(api.deleteApplicationPackageVersionLogConfig, { packageVersionId, configId }, {
                    success: () => {
                        this.setState({
                            isLogManageModalVisible: false
                        })
                        this.getApplicationPackageVersionLogConfigs() // 更新日志列表
                        notification.notice({
                            id: new Date(),
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `${title}${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    renderPortPanel = () => {
        const { intl } = this.props
        const { currentVersion, portList } = this.state
        return (
            <div className='portManage'>
                <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                    <Button
                        type="operate"
                        icon={<Icon type="add" />}
                        onClick={() => this.handleChange('isPortManageModalVisible', true)}
                        name="新增入口"
                        className='addBtn'
                        disabled={!currentVersion.id || currentVersion.isCommit}
                    />
                </ActionAuth>
                <div className='portList'>
                    {
                        portList.map((item) => {
                            const { id, name, description, type, config, chartExist } = item
                            return (
                                <Card
                                    disabled={currentVersion.isCommit}
                                    action={actions.AdminApplicationCenterApplicationPackageVersionOperate}
                                    handleDelete={() => this.handleDeletePort(id, name)}
                                    key={id}>
                                    <div className='portName'>
                                        {name}&nbsp;
                                        {
                                            chartExist ? null : (
                                                <Popover
                                                    placement="top"
                                                    content={<div>入口对应资源已不存在</div>}
                                                    trigger="hover"
                                                    type="text"
                                                >
                                                    <i className='iconfont icon-warning-o text-danger' />
                                                </Popover>
                                            )
                                        }
                                    </div>
                                    <div className='portDes'>
                                        <span>{description}</span>
                                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                                            <UltrauiButton
                                                type="text"
                                                onClick={() => this.handleManagePort(item)}
                                                disabled={currentVersion.isCommit}
                                            >
                                                <Icon type="edit" />&nbsp;{intl.formatMessage({ id: 'Manage' })}
                                            </UltrauiButton>
                                        </ActionAuth>
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
                    success: (res) => {
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
        const { intl } = this.props
        const { currentVersion: { id } } = this.state
        Modal.confirm({
            title: intl.formatMessage({ id: 'SubmitAppPackageVersion' }),
            content: '确认提交该应用包版本吗？',
            onOk: () => {
                HuayunRequest(api.updateApplicationPackageVersionChartCommit, { id }, {
                    success: (res) => {
                        const { retCode, retInfo } = res.data
                        if (retCode) {
                            notification.notice({
                                id: new Date(),
                                type: 'danger',
                                title: intl.formatMessage({ id: 'Error' }),
                                content: retInfo,
                                iconNode: 'icon-error-o',
                                duration: 5,
                                closable: true
                            })
                        } else {
                            notification.notice({
                                id: new Date(),
                                type: 'success',
                                title: intl.formatMessage({ id: 'Success' }),
                                content: `${intl.formatMessage({ id: 'Submit' })}${intl.formatMessage({ id: 'AppPackageVersion' })}${intl.formatMessage({ id: 'Success' })}`,
                                iconNode: 'icon-success-o',
                                duration: 5,
                                closable: true
                            })
                            this.getApplicationPackageVersionInfo(id)
                        }
                    }
                })
            }
        })
    }
    // 验证yaml
    handleValidateStatement = () => {
        const { intl } = this.props
        const { currentVersionId } = this.state
        let params = {
            id: currentVersionId,
            chartFileJson: JSON.stringify(this.$FileEdit.state.treeData[0])
        }
        HuayunRequest(api.verifyChartContent, params, {
            success: (res) => {
                const { retCode, retInfo } = res.data
                if (retCode) {
                    this.$FileEdit.setState({
                        validErrorMessage: retInfo
                    })
                } else {
                    notification.notice({
                        id: new Date(),
                        type: 'success',
                        title: intl.formatMessage({ id: 'Success' }),
                        content: `${intl.formatMessage({ id: 'Validate' })}${intl.formatMessage({ id: 'AppPackageVersion' })}${intl.formatMessage({ id: 'Success' })}`,
                        iconNode: 'icon-success-o',
                        duration: 5,
                        closable: true
                    })
                }
            }
        })
    }
    // 保存yaml
    handleSaveStatement = () => {
        const { intl } = this.props
        const { currentVersionId } = this.state
        let params = {
            id: currentVersionId,
            chartFileJson: JSON.stringify(this.$FileEdit.state.treeData[0])
        }
        HuayunRequest(api.updateApplicationPackageVersionSaveChartFile, params, {
            success: (res) => {
                this.getApplicationPackageVersionInfo(currentVersionId)
                notification.notice({
                    id: new Date(),
                    type: 'success',
                    title: intl.formatMessage({ id: 'Success' }),
                    content: `${intl.formatMessage({ id: 'Save' })}${intl.formatMessage({ id: 'AppPackageVersion' })}${intl.formatMessage({ id: 'Success' })}`,
                    iconNode: 'icon-success-o',
                    duration: 5,
                    closable: true
                })
                this.setState({
                    isStateManageModalVisible: false
                })
            }
        })
    }
    handleDownload = () => {
        const { currentVersion: { id } } = this.state
        let data = { id }
        const url = `/api/${api.downApplicationPackageVersionChart}`
        fetch(url, {
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
        this.props.history.push(`/applicationCenter/applicationManage/create?applicationPackageId=${applicationPackageId}&applicationPackageVersionId=${applicationPackageVersionId}`)
    }
    handleSelectVersion = (id) => {
        if (id === this.state.currentVersionId) return
        this.setState({
            currentVersionId: id,
            tabActiveKey: '1'
        }, () => {
            this.getApplicationPackageVersionInfo(id)
            this.getApplicationPackageVersionLogConfigs(id)
            this.getAlarmConfigData(id)
        })
    }
    handleAlarmConfigModalConfirm = () => {
        const { intl } = this.props
        this.$AlarmConfig.props.form.validateFields((error, values) => {
            if (!error) {
                const { isStart, alarmTemplates, notifyUsers } = this.$AlarmConfig.state
                const params = {
                    applicationPackageVersionId: this.state.currentVersionId,
                    isStart,
                    alarmTemplates: alarmTemplates.map(id => {
                        return { id }
                    }),
                    notifyUsers: notifyUsers.map(id => {
                        return { id }
                    }),
                }
                HuayunRequest(api.confirmApplicationPackageVersionAlarmConfig, params, {
                    success: (res) => {
                        this.setState({
                            isAlarmConfigModalVisible: false
                        })
                        this.getAlarmConfigData()
                        notification.notice({
                            id: 'updateSuccess',
                            type: 'success',
                            title: intl.formatMessage({ id: 'Success' }),
                            content: `更新告警配置${intl.formatMessage({ id: 'Success' })}`,
                            iconNode: 'icon-success-o',
                            duration: 5,
                            closable: true
                        })
                    }
                })
            }
        })
    }
    renderStatementModalTitle = () => {
        const { intl } = this.props
        return (
            <div className='modalTitle'>
                {intl.formatMessage({ id: 'ManageStatement' })}
                <Popover
                    placement="right"
                    content={<div>平台会自动为每个使用镜像的应用创建一个名为 secret-image 的 Secret 作为容器获取镜像的凭证</div>}
                    trigger="hover"
                    type="text"
                >
                    <a>&nbsp;&nbsp;镜像获取凭证</a>
                </Popover>
            </div>
        )
    }
    // 针对入口管理，要切换到该tab下，再去掉入口的列表数据
    handleTabChange = (key) => {
        this.setState({
            tabActiveKey: key
        })
        key === '3' && this.getAppPackagePortData()
    }
    render() {
        const { intl, currentDataItem, applicationPackageVersionList } = this.props
        const {
            currentVersionId, currentVersion, isVersionModalVisible, isPortManageModalVisible, isStateManageModalVisible, currentPort,
            isAlarmConfigModalVisible, alarmDetail, alarmTemplates, alarmContacts, isLogManageModalVisible, currentLog, tabActiveKey
        } = this.state
        const tabOperation = {
            right: [
                <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                    <UltrauiButton
                        type="text"
                        onClick={() => this.handleChange('isStateManageModalVisible', true)}
                        disabled={!currentVersion.id}
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
                <ActionAuth action={actions.AdminApplicationCenterApplicationOperate}>
                    <UltrauiButton
                        type="text"
                        onClick={this.handleAddApplication}
                        disabled={!currentVersion.isCommit}
                    >
                        <Icon type="add" />&nbsp;{intl.formatMessage({ id: 'CreateApplication' })}
                    </UltrauiButton>
                </ActionAuth>
            ]
        }
        return (
            <div className='versionManage'>
                <Tabs activeKey={tabActiveKey} className='versionOperateBar' tabBarExtraContent={tabOperation} onChange={this.handleTabChange}>
                    <TabPane tab={intl.formatMessage({ id: 'BasicInfo' })} key="1">
                        {this.renderVersionInfoPanel()}
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'Log' })} key="2">
                        {this.renderLogPanel()}
                    </TabPane>
                    <TabPane tab={`${intl.formatMessage({ id: 'Manage' })}${intl.formatMessage({ id: 'Entrance' })}`} key="3">
                        {this.renderPortPanel()}
                    </TabPane>
                    <TabPane tab={intl.formatMessage({ id: 'Alarm' })} key="4">
                        {this.renderAlarmPanel()}
                    </TabPane>
                </Tabs>
                <div className='versionList'>
                    <div className='title'>
                        版本列表
                        <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                            <UltrauiButton
                                type="text"
                                onClick={() => this.handleChange('isVersionModalVisible', true)}
                                className='br'
                            >
                                <Icon type="add" />&nbsp;新增
                            </UltrauiButton>
                        </ActionAuth>
                    </div>
                    <div className='listContent'>
                        {
                            (applicationPackageVersionList || []).map((item) => {
                                const { id, name, createTime, isCommit } = item
                                return (
                                    <div className='versionItem' key={id} onClick={() => this.handleSelectVersion(id)}>
                                        <span className={`versionName ${currentVersion.id === id ? 'activeBefore' : ''}`}>
                                            <div className='stateLineWithDot'>
                                                <div className={`stateDot ${isCommit ? 'bg-success' : 'bg-default'}`}></div>
                                                {name}
                                            </div>
                                            <ActionAuth action={actions.AdminApplicationCenterApplicationPackageVersionOperate}>
                                                <Icon type='error-o' onClick={() => this.handleDelete([id])} />
                                            </ActionAuth>
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
                <Modal
                    title={this.renderStatementModalTitle()}
                    visible={isStateManageModalVisible}
                    footer={[
                        <Button key='back' disabled={currentVersion.isCommit} onClick={this.handleSaveStatement} >{intl.formatMessage({ id: 'Save' })}</Button>,
                        <Button key='submit' type='primary' onClick={this.handleValidateStatement} >{intl.formatMessage({ id: 'Validate' })}</Button>
                    ]}
                    onCancel={() => this.handleChange('isStateManageModalVisible', false)}
                    className='stateManageModal'
                    destroyOnClose={true}
                    width={680}
                >
                    <FileEdit
                        {...this.props}
                        currentVersion={currentVersion}
                        ref={node => this.$FileEdit = node} />
                </Modal>
                <Modal
                    title='告警配置'
                    visible={isAlarmConfigModalVisible}
                    onOk={this.handleAlarmConfigModalConfirm}
                    onCancel={() => this.handleChange('isAlarmConfigModalVisible', false)}
                    className='alarmConfigManageModal'
                    destroyOnClose={true}
                >
                    <AlarmConfig
                        intl={intl}
                        alarmDetail={alarmDetail}
                        alertTemplateList={alarmTemplates}
                        alertUserList={alarmContacts}
                        wrappedComponentRef={node => this.$AlarmConfig = node} />
                </Modal>
                <Modal
                    title={currentLog.configId ? '编辑日志' : '添加日志'}
                    visible={isLogManageModalVisible}
                    onOk={this.handleLogManageModalConfirm}
                    onCancel={() => this.handleChange('isLogManageModalVisible', false)}
                    className='applicationPackageVersion_logManageModal'
                    destroyOnClose={true}
                >
                    <LogManage
                        intl={intl}
                        currentLog={currentLog}
                        currentVersionId={currentVersionId}
                        wrappedComponentRef={node => this.$LogManage = node} />
                </Modal>
            </div>
        )
    }
}

export default VersionManage
